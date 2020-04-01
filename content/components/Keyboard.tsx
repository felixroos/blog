import React, { useState, useRef } from "react"
import { renderSVG } from "svg-piano"
import { useMouseDrag } from "./useMouseDrag"
import { useKeyEvents } from "./useKeyEvents"

export default function Keyboard({
  options,
  onClick,
  onAttack,
  onRelease,
  keyControl,
}: any) {
  const active = useRef([])
  const [colorized, setColorized] = useState([])
  useKeyEvents({
    downHandler: e =>
      keyControl &&
      keyControl[e.key] &&
      activate({ notes: [keyControl[e.key]] }),
    upHandler: e =>
      keyControl &&
      keyControl[e.key] &&
      deactivate({ notes: [keyControl[e.key]] }),
  })

  const activate = key => {
    if (!colorized.includes(key.notes[0])) {
      active.current = [...active.current, key.notes[0]]
      onAttack && onAttack(key)
    }
    setColorized(active.current)
  }

  const deactivate = key => {
    if (colorized.includes(key.notes[0])) {
      active.current = active.current.filter(n => n !== key.notes[0])
      onRelease && onRelease(key)
    }
    setColorized(active.current)
  }

  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
  } = useMouseDrag({ activate, deactivate })

  const { svg, children } = renderSVG({
    ...options,
    colorize: [...(options.colorize || []), { keys: colorized, color: "red" }],
  })
  return (
    <svg {...svg}>
      {children
        .filter(c => !!c)
        .map(({ polygon, circle, text, key }, index) => [
          polygon && (
            <polygon
              {...polygon}
              key={"p" + index}
              onMouseDown={() => handleMouseDown(key)}
              onMouseUp={() => handleMouseUp(key)}
              onMouseEnter={() => handleMouseEnter(key)}
              onMouseLeave={() => handleMouseLeave(key)}
              onClick={() => onClick && onClick(key)}
            />
          ),
          circle && (
            <circle
              {...circle}
              key={"c" + index}
              style={{ pointerEvents: "none" }}
            />
          ),
          text && (
            <text
              {...text}
              key={"t" + index}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {text.value}
            </text>
          ),
        ])}
    </svg>
  )
}

/*

<Keyboard
        options={{
          range: ["A2", "C4"],
          scaleX: 2,
          scaleY: 2,
          lowerHeight: 0,
          upperHeight: 15,
          topLabels: true,
          labels: {
            C3: "1",
            Eb3: "b3",
            G3: "5",
            Bb3: "7"
          },
          colorize: [
            {
              keys: ["C3", "Eb3", "G3", "B3"],
              color: "lightblue"
            }
          ]
        }}
      />
<Keyboard
        options={{
          range: ["A0", "C8"],
          palette: ["white", "black"],
          stroke: "white",
          scaleX: 0.5,
          scaleY: 0.5
        }}
      />
      */
