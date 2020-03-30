import { useState, useEffect } from "react"

export function useMouseDrag({ activate, deactivate }) {
  // listen for document mouse up
  useEffect(() => {
    const handleMouseUp = () => setMouseDown(false)
    const handleMouseDown = () => setMouseDown(true)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mousedown", handleMouseDown)
    return () => {
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mousedown", handleMouseDown)
    }
  }, [])

  const [mouseDown, setMouseDown] = useState(false)

  function handleMouseDown() {
    setMouseDown(true)
    activate(...arguments)
  }
  function handleMouseEnter() {
    if (mouseDown) {
      activate(...arguments)
    }
  }
  function handleMouseUp() {
    deactivate(...arguments)
  }
  function handleMouseLeave() {
    if (mouseDown) {
      deactivate(...arguments)
    }
  }
  return {
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    handleMouseLeave,
    bind: () => ({
      onMouseDown: handleMouseDown,
      onMouseEnter: handleMouseEnter,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
    }),
  }
}
