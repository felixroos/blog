import React, { useState } from "react"
import useFrame from "./useFrame"

export default function AnimationFrame(props) {
  const [time, setTime] = useState()
  const frame = useFrame(setTime)
  return props.children({ ...frame, time })
}
