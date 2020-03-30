import React from "react"
import { Note } from "@tonaljs/tonal"

export default function NoteSelect({ onChange, value }) {
  function handleChange(e) {
    onChange && onChange(e.target.value)
  }
  const notes = [
    ...Note.names(),
    ...Note.names().map(n => n + "xb"),
    ...Note.names().map(n => n + "#"),
  ].sort()
  return (
    <select value={value} onBlur={handleChange}>
      {notes.map((note, index) => (
        <option key={index}>{note}</option>
      ))}
    </select>
  )
}
