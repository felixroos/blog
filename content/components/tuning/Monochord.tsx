import React, { useState } from "react"
import { useDrag, useHover, useGesture } from "react-use-gesture"
import { scaleLinear } from "d3-scale"
import Fraction from "fraction.js"
import FractionCircle from "../common/FractionCircle"
import { frequencyColor } from "./tuning"
import * as Tone from "tone"
import canUseDOM from "../canUseDOM"
import { Plot } from "../common/Plot"
import useFrame from "../common/useFrame"
const { PolySynth, Synth } = Tone
const harp =
  canUseDOM() &&
  new PolySynth(6, Synth, {
    volume: -10,
    envelope: {
      attack: 0.01,
      decay: 0.9,
      sustain: 0,
      release: 0,
      decayCurve: "linear",
    },
    oscillator: {
      type: "triangle",
    },
  }).toMaster()

export default function Monochord({
  value,
  base,
  disableRight,
  ticks,
  width,
  factor,
  strokeWidth,
}) {
  base = base || 440
  const [amplitude, setAmplitude] = useState(0)
  factor = factor || 1
  disableRight = typeof disableRight === "undefined" ? true : disableRight
  const [{ x }, set] = useState({ x: Math.min(value || 1, 1) })
  const [firstX, setFirstX] = useState(x)
  const radius = 15
  width = width || 400
  const margin = { left: radius * 2, right: radius * 2 }
  const colors = {
    line: "white",
    circle: "rgba(100,100,100,0.5)",
  }
  ticks = ticks || 12
  const circlePadding = radius / 2
  strokeWidth = strokeWidth || 4
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

  const duration = 1000
  const speed = ((1 / x) * base * factor) / 50
  const { start, stop } = useFrame(({ fromStart, progress }) => {
    setAmplitude(
      (1 - progress) * Math.sin((speed * Math.PI * 2 * fromStart) / 1000)
    )
  }, false)

  function play() {
    start(duration)
    harp.triggerAttackRelease((1 / (x || 1)) * base, duration / 1000)
  }

  const hover = useGesture({
    onMoveStart: ({ args: r }) => play(),
  })
  const px = scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right])

  const [lt, lb] = new Fraction(x * factor).toFraction().split("/")
  const [rt, rb] = new Fraction(factor + (1 - x)).toFraction().split("/")

  return (
    <svg width={width} height={height}>
      <g {...hover()} onClick={() => play()}>
        <FractionCircle
          cx={radius}
          cy={radius - 1}
          radius={radius}
          strokeWidth={1}
          top={lt || 1}
          bottom={lb || 1}
          invert={true}
          base={base}
        />
      </g>
      {!disableRight ? (
        <FractionCircle
          cx={width - radius - 2}
          cy={radius - 1}
          radius={radius}
          strokeWidth={1}
          top={rt || 1}
          bottom={rb || 1}
          invert={true}
          base={base}
        />
      ) : (
        <line
          stroke="gray"
          strokeWidth={2}
          x1={width - radius * 2}
          x2={width - radius * 2}
          y1={radius - 10}
          y2={radius + 10}
        />
      )}

      <g transform={`translate(${px(0)},0)`} {...hover()}>
        <Plot
          margin={{ top: strokeWidth, bottom: strokeWidth, left: 0, right: 0 }}
          functions={[(_x) => amplitude * Math.sin(_x)]}
          range={{ x: [0, Math.PI], y: [-1, 1] }}
          hideAxes={true}
          height={radius * 2}
          colors={[frequencyColor((1 / (x || 1)) * base)]}
          width={px(x) - px(0)}
          strokeWidth={strokeWidth}
        />
      </g>
      {/*  <line
        className="string-left"
        x1={px(0)}
        x2={px(x)}
        y1={radius}
        y2={radius}
        {...hover(x)}
        stroke={frequencyColor((1 / (x || 1)) * base)}
        strokeWidth={strokeWidth}
      /> */}
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
            strokeWidth={2}
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
            r={radius - 2}
            strokeWidth={0}
            stroke={colors.circle}
            fill={colors.circle}
          />
        </>
      )}
    </svg>
  )
}
