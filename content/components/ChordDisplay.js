import React, { useState, useMemo } from "react"

import Keyboard from "./Keyboard"
import { Note } from "@tonaljs/tonal"
import { ChordType } from "@tonaljs/tonal"
import { useMouseDrag } from "./useMouseDrag"
import { PolySynth, Synth } from "tone"

const allNotes = [
  ...Note.names(),
  ...Note.names().map(n => n + "b"),
  ...Note.names().map(n => n + "#"),
]

function getChordNotes(tonic, symbol) {
  return ChordType.get(symbol).intervals.map(interval =>
    Note.transpose(tonic, interval)
  )
}
const isBrowser = typeof window !== "undefined"

export default function ChordDisplay() {
  const poly = useMemo(
    () => isBrowser && new PolySynth(6, Synth, { volume: -12 }).toMaster(),
    []
  )

  const [note, setNote] = useState("C3")
  const [chord, setChord] = useState("major")
  const [active, setActive] = useState(getChordNotes(note, chord))

  function attack(note) {
    const notes = getChordNotes(note, chord)
    setActive(notes)
    poly.triggerAttack(notes)
  }

  const mouseEvents = useMouseDrag({
    activate: () => poly.triggerAttack(active),
    deactivate: () => poly.triggerRelease(active),
  })

  return (
    <>
      <select
        value={note.replace(/[0-9]/, "")}
        onChange={e => {
          setNote(e.target.value + "3")
          setActive(getChordNotes(e.target.value + "3", chord))
        }}
      >
        {allNotes.map((note, index) => (
          <option key={index}>{note}</option>
        ))}
      </select>
      <select
        value={chord}
        onChange={e => {
          setChord(e.target.value)
          setActive(getChordNotes(note, e.target.value))
        }}
      >
        {ChordType.names().map((_chord, index) => (
          <option key={index}>{_chord}</option>
        ))}
      </select>
      <button {...mouseEvents.bind()}>play</button>
      <br />
      <Keyboard
        onAttack={key => {
          setNote(key.notes[0])
          attack(key.notes[0])
        }}
        onRelease={() => {
          poly.triggerRelease(active)
        }}
        options={{
          range: ["B2", "C5"],
          scaleX: 2,
          scaleY: 2,
          colorize: [
            {
              color: "yellow",
              keys: active.map(n => Note.simplify(n)),
            },
          ],
          labels: active.reduce(
            (l, n) => ({ ...l, [Note.simplify(n)]: n }),
            {}
          ),
        }}
      />
    </>
  )
}
