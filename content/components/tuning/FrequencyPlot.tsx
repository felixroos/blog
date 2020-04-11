import React from "react"
import { Plot } from "../common/Plot"
import { frequencyColor } from "./tuning"

export function FrequencyPlot({ frequencies, addSum, height, width, colors }) {
  addSum = addSum !== undefined ? addSum : true
  const functions = (
    frequencies || []
  ).map(([frequency, amplitude, phase]) => (x) =>
    Math.sin(frequency * x + (phase / 180) * Math.PI) * amplitude
  )
  if (addSum) {
    const sum = (x) => functions.slice(0, -1).reduce((sum, f) => f(x) + sum, 0)
    functions.push(sum)
  }

  return (
    <>
      <Plot
        strokeWidth={5}
        width={width}
        height={height}
        functions={functions}
        colors={
          colors ||
          frequencies.map(([f]) => frequencyColor(f)).concat(["green"])
        }
        range={{
          x: [0, Math.PI * 2],
          y: [-2, 2],
        }}
      />
    </>
  )
}
