import React, { useMemo, useRef, useEffect } from "react"
import { frequencyColor } from "./tuning"
import { gcd } from "../common/gcd"
import canUseDOM from "../canUseDOM"
import * as Tone from "tone"
const { PolySynth, Synth } = Tone
const harp = canUseDOM() && new PolySynth(6, Synth, { volume: -6 }).toMaster()

export function Lambdoma({
  radius,
  margin,
  cols,
  rows,
  base,
  filter,
  hideExtensions,
  hideLines,
  hideZeroes,
  min,
  max,
  clamp,
  angle,
}: any) {
  const containerRef = useRef<any>()
  margin = margin !== undefined ? margin : radius * 0.2
  base = base || 440
  hideZeroes = hideZeroes === "undefined" ? false : hideZeroes

  angle = ((typeof angle !== "number" ? 45 : angle) / 180) * Math.PI

  cols += 1
  rows += 1
  let size = {
    width: cols * (radius * 2 + margin),
    height: rows * (radius * 2 + margin),
  }
  if (angle) {
    const { width, height } = size
    const diagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
    size = {
      width: diagonal,
      height: diagonal,
    }
  }
  if (clamp) {
    min = 0.5
    /* min = 1 */
    max = 2
  }

  const grid: any = Array.from({ length: cols }).reduce(
    (flat: any[], _, col) =>
      flat.concat(
        Array.from({ length: rows })
          .map((_, row) =>
            hideZeroes
              ? [(col + 1) / (row + 1), col + 1, row + 1]
              : [col && row ? col / row : null, col, row]
          )
          .filter(([value, top, bottom]) => {
            if (hideZeroes && (top === rows || bottom === cols)) {
              // filter out last extra row
              return false
            }
            if (!value) {
              return clamp ? top === bottom : true
            }
            if (hideExtensions && gcd(top, bottom) !== 1) {
              return false
            }
            if (typeof min === "number" && value < min) {
              return false
            }
            if (typeof max === "number" && value > max) {
              return false
            }
            /* (isPrime(col) || isPrime(row)) && */
            if (typeof filter === "function" && !filter([value, top, bottom])) {
              return false
            }
            return true
          })
      ),
    []
  )

  const coordinates = (top, bottom) => {
    let { x, y } = {
      x: top * (radius * 2 + margin) + radius,
      y: bottom * (radius * 2 + margin) + radius,
    }
    if (angle) {
      const sin = Math.sin(angle)
      const cos = Math.cos(angle)
      return {
        x: x * cos - y * sin + size.width / 2,
        y: x * sin + y * cos,
      }
    }
    return { x, y }
  }

  const lineTo = (col, row) => {
    /* const { x: x1, y: y1 } = coordinates(cols/2, rows/2) */
    const { x: x1, y: y1 } = coordinates(0, 0)
    const { x: x2, y: y2 } = coordinates(col, row)
    return {
      x1,
      x2,
      y1,
      y2,
      stroke: frequencyColor((col / row) * base),
      strokeWidth: 2,
    }
  }
  /* {!hideLines &&
    Array.from({ length: cols - 1 }).map((_, col) => (
      <line {...lineTo(col + 1, rows - 1)} />
    ))}
  {!hideLines &&
    Array.from({ length: rows - 1 }).map((_, row) => (
      <line {...lineTo(cols - 1, row)} />
    ))} */

  const maxWidth = 600
  const maxHeight = 600
  const diff = size.width - maxWidth
  if (diff > 0 && containerRef.current && angle !== 0) {
    containerRef.current.scrollLeft = diff / 2
  }

  return (
    <>
      <div
        style={{
          overflow: "auto",
          maxHeight,
          width: maxWidth,
          textAlign: "center",
        }}
        ref={containerRef}
      >
        <svg {...size} style={{ maxWidth: size.width }}>
          {!hideLines &&
            // filters shorter lines behind longer lines in same direction
            // seems faster without
            grid
              .filter(
                ([value, top, bottom], index) =>
                  !grid.find(
                    ([_value, _top, _bottom], _index) =>
                      _index > index && _value === value
                  )
              )
              .map(([value, top, bottom]) => (
                <g key={`${top}-${bottom}`}>
                  <line {...lineTo(top, bottom)} />
                </g>
              ))}

          {grid.map(([value, top, bottom]) => {
            const { x, y } = coordinates(top, bottom)
            return (
              <g key={`${top}-${bottom}`}>
                <Fraction
                  border={1}
                  base={base}
                  top={top}
                  bottom={bottom}
                  radius={radius}
                  cx={x}
                  cy={y}
                />
              </g>
            )
          })}
        </svg>
      </div>
    </>
  )
}

export function Fraction({
  radius: _radius,
  cx,
  cy,
  top,
  bottom,
  base,
  border,
}: any) {
  base = base || 440
  const circle = {
    radius: _radius || 30,
    padding: 0.4,
    cx: cx || 100,
    cy: cy || 100,
    fontSize: 12,
  }
  border = typeof border === "number" ? border : 1
  const strokeWidth = (circle.radius / 16) * border
  const x = circle.cx + strokeWidth
  const y = circle.cy + strokeWidth
  const radius = circle.radius
  const text = {
    fontSize: radius * 0.6,
    textAnchor: "middle",
    pointerEvents: "none",
  }
  const value = useMemo(() => top / bottom, [top, bottom])

  function handleTrigger() {
    harp.triggerAttackRelease(value * base, "4n")
  }
  const fill = !top || !bottom ? "white" : frequencyColor(value * base)
  return (
    <>
      <circle
        onClick={handleTrigger}
        cx={x}
        cy={y}
        r={radius}
        fill={fill}
        stroke="black"
        strokeWidth={strokeWidth}
      />
      <text x={x} y={y - radius / 4} {...text}>
        {top}
      </text>
      <text x={x} y={y + radius / 2 + text.fontSize / 4} {...text}>
        {bottom}
      </text>
      <line
        x1={x - radius + circle.padding * radius}
        x2={x + radius - circle.padding * radius}
        y1={y}
        y2={y}
        stroke="black"
        strokeWidth={strokeWidth}
        style={{ pointerEvents: "none" }}
      />
    </>
  )
}
