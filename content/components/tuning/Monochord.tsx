import React, { useState } from "react"
import { useDrag, useHover, useGesture } from "react-use-gesture"
import { scaleLinear } from "d3-scale"
import Fraction from "fraction.js"
import FractionCircle from "../common/FractionCircle"
import { frequencyColor } from "./tuning"
import * as Tone from "tone"
import canUseDOM from "../canUseDOM"
const { PolySynth, Synth } = Tone
const harp = canUseDOM() && new PolySynth(6, Synth, { volume: -6 }).toMaster()

export default function Monochord({ value, base, disableRight }) {
  base = base || 440
  const [{ x }, set] = useState({ x: value || 0 })
  const [firstX, setFirstX] = useState(x)
  const radius = 15
  const width = 500
  const margin = { left: radius * 2, right: radius * 2 }
  const colors = {
    line: "white",
    circle: "rgba(100,100,100,0.5)",
  }
  const ticks = 12
  const circlePadding = radius / 2
  const strokeWidth = 4
  const innerWidth = width - margin.left - margin.right
  const height = radius * 2
  const drag = useDrag(({ down, movement: [mx, my], first }) => {
    if (first || !down) {
      setFirstX(x)
    }
    set({
      x: Math.min(
        1,
        Math.max(0, Math.round((mx / innerWidth) * ticks) / ticks + firstX)
      ),
    })
  })
  const hover = useGesture({
    onMoveStart: ({ args: value }) => {
      harp.triggerAttackRelease((1 / (value || 1)) * base, "4n")
    },
  })
  const px = scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right])

  const [lt, lb] = new Fraction(x).toFraction().split("/")
  const [rt, rb] = new Fraction(1 - x).toFraction().split("/")

  return (
    <svg width={width} height={height}>
      <FractionCircle
        cx={radius}
        cy={radius - 1}
        radius={radius}
        strokeWidth={1}
        top={lt}
        bottom={lb || 1}
        invert={true}
        base={base}
      />
      {!disableRight && (
        <FractionCircle
          cx={width - radius - 2}
          cy={radius - 1}
          radius={radius}
          strokeWidth={1}
          top={rt}
          bottom={rb || 1}
          invert={true}
          base={base}
        />
      )}
      <line
        className="string-left"
        x1={px(0)}
        x2={px(x)}
        y1={radius}
        y2={radius}
        {...hover(x)}
        stroke={frequencyColor((1 / (x || 1)) * base)}
        strokeWidth={strokeWidth}
      />
      <line
        className="string-right"
        x1={px(x)}
        x2={px(1)}
        y1={radius}
        y2={radius}
        {...(disableRight ? {} : hover(1 - x))}
        stroke={
          disableRight ? "gray" : frequencyColor((1 / (x ? 1 - x : 1)) * base)
        }
        strokeWidth={strokeWidth}
      />
      <g style={{ pointerEvents: "none", userSelect: "none" }}>
        {![1, 0].includes(x) && (
          <line
            className="tick"
            y1={radius - circlePadding}
            y2={radius + circlePadding}
            x1={px(x)}
            x2={px(x)}
            stroke={colors.line}
            strokeWidth={strokeWidth}
          />
        )}
      </g>
      {![1, 0].includes(x) && (
        <>
          <circle
            className="handle"
            {...drag()}
            cx={px(x)}
            cy={radius}
            style={{ cursor: "pointer" }}
            r={radius - strokeWidth}
            strokeWidth={0}
            stroke={colors.circle}
            fill={colors.circle}
          />
        </>
      )}
    </svg>
  )
}
