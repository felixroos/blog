import React from "react"

export default function Slider({ value, min, max }) {
  const [state, setState] = value
  const diff = max - min
  return (
    <input
      type="range"
      value={((state - min) / diff) * 100}
      onChange={e => setState((e.target.value / 100) * diff + min)}
    />
  )
}
