import React from "react"
import Keyboard from "../Keyboard"
import { Range } from "@tonaljs/tonal"
import { noteColor } from "./noteColor"

export function ColorKeyboard({ options, colorizer = noteColor }) {
  options = { range: ["C3", "C4"], ...options }
  return (
    <Keyboard
      options={{
        ...options,
        colorize: Range.chromatic(options.range).map(note => ({
          keys: [note],
          color: colorizer(note),
        })),
      }}
    />
  )
}
