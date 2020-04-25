import * as React from "react"
import { useState } from "react"

export default function ReactApp() {
  const [count, setCount] = useState(0)
  return (
    <>
      {count} <button onClick={() => setCount(count + 1)}>increment</button>
    </>
  )
}
