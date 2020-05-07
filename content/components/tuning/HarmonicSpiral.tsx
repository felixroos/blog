import React from "react"
import Spiral, { SpiralProps, Line } from "../common/Spiral"
import { angle, frequencyColor } from "../tuning/tuning"

export default function HarmonicSpiral(props: SpiralProps) {
  const { min, max, zoom, spin, precision, strokeWidth } = props
  function getLines(): Line[] {
    return Array.from({ length: Math.pow(2, max - 1 - min) }, (_, i) => [
      angle(i + 1) + min,
      angle(i + 1) + min + 1,
      frequencyColor((i + 1) * 440),
    ])
  }
  function getLabels() {
    return (
      Array.from({ length: Math.pow(2, max - min) }, (_, i) => i + 1)
        /*.filter((n) => n === 2 || n % 2)*/
        .map((n) => ({
          label: n + "",
          angle: angle(n) + min,
          fill: frequencyColor(n * 440),
          color: "black",
        }))
    )
  }
  return <Spiral {...props} lines={getLines()} labels={getLabels()} />
}
