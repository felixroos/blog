import React, { useRef, useEffect } from "react"
import { Runtime, Inspector } from "@observablehq/runtime"

export default function ObservableNotebook({ notebook }) {
  const container = useRef()
  useEffect(() => {
    if (!container.current || !notebook) {
      return
    }
    container.current.innerHTML = ""
    Runtime.load(notebook, Inspector.into(container.current))
  }, [notebook])
  return <div ref={container}></div>
}
