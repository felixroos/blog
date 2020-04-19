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

  function handleMouseDown(...args: any[]) {
    setMouseDown(true)
    activate(...args)
  }
  function handleMouseEnter(...args: any[]) {
    if (mouseDown) {
      activate(...args)
    }
  }
  function handleMouseUp(...args: any[]) {
    deactivate(...args)
  }
  function handleMouseLeave(...args: any[]) {
    if (mouseDown) {
      deactivate(...args)
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
