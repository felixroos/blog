import React, { useState } from "react"
import { Plot } from "../common/Plot"
import { frequencyColor } from "./tuning"
import useFrame from "../common/useFrame"
import { Button } from "@material-ui/core"

export function FrequencyPlot({
  base,
  frequencies,
  addSum,
  height,
  width,
  colors,
  onTrigger,
  autostartAnimation,
  animationSpeed,
  range,
}: any) {
  const [time, setTime] = useState(0)
  base = base || 440
  animationSpeed =
    typeof animationSpeed === "number" ? animationSpeed : 1 / base
  addSum = addSum !== undefined ? addSum : true
  const animateAmplitude = true
  const animatePhase = false
  const functions = (
    frequencies || []
  ).map(([frequency, amplitude, phase]) => (x) =>
    Math.sin(
      frequency * x +
        ((phase + (animatePhase ? (time * frequency * base) / 10 : 0)) / 180) *
          Math.PI
    ) *
    amplitude *
    (animateAmplitude ? Math.cos(time * frequency) : 1)
  )
  if (addSum) {
    const sum = (x) => functions.slice(0, -1).reduce((sum, f) => f(x) + sum, 0)
    functions.push(sum)
  }

  const { toggle } = useFrame((t) => {
    setTime(t * animationSpeed)
  }, autostartAnimation)

  return (
    <>
      {/* <Button onClick={() => toggle()}>Toggle</Button> */}
      <Plot
        onClick={() => toggle()}
        strokeWidth={5}
        width={width}
        height={height}
        grid={{ x: Math.PI / 4, y: 0.5 }}
        functions={functions}
        colors={
          colors ||
          frequencies.map(([f]) => frequencyColor(f * base)).concat(["green"])
        }
        range={
          range || {
            x: [0, Math.PI],
            y: [-1, 1],
          }
        }
        onHover={(i) => {
          if (i === frequencies.length) {
            return // is sum
          }
          // console.log("hover!", i, frequencies[i][0]*base)
          const [f, a] = frequencies[i]
          onTrigger && onTrigger(f * base, Math.abs(a))
          // synth.triggerAttackRelease(f * base, "4n", "+0", Math.abs(a))
        }}
      />
    </>
  )
}
