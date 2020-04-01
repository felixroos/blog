import React, { useState } from "react"
import Keyboard from "./Keyboard"
import Slider from "./Slider"

import * as Tone from "tone"

const { Synth } = Tone

const synth = new Synth({ volume: -6 }).toMaster()

export default function Keyboards() {
  const [scale, setScale] = useState(0.5)

  return (
    <>
      <label>Scale</label>
      <Slider value={[scale, setScale]} min={0.5} max={1.5} />
      <br />

      <Keyboard
        options={{
          range: ["A0", "C8"],
          scaleX: scale,
          scaleY: scale,
        }}
        onClick={key => {
          synth.triggerAttackRelease(key.notes[0], "8n")
        }}
      />
    </>
  )
}
