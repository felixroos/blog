import React from "react"
import { Plot } from "../common/Plot"
import { frequencyColor } from "./tuning"

export function PitchClasses({ frequencies, strokeWidth }: any) {
  return (
    <Plot
      strokeWidth={strokeWidth}
      width={600}
      height={300}
      functions={frequencies.map((f) => (x) => f * Math.pow(2, x))}
      colors={frequencies.map((f) => frequencyColor(f))}
      range={{ x: [0, 10], y: [0, 20000] }}
    />
  )
}
