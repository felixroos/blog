import React from "react"
import { scaleLinear } from "d3-scale"
import { extent } from "d3-array"

export function PlotPath({ f }) {}

export function Plot({
  strokeWidth,
  functions,
  width,
  height,
  range,
  colors,
}: any) {
  width = width || 600
  height = height || 600
  strokeWidth = strokeWidth || 1
  colors = colors || []
  functions = functions || []
  const w = Math.min(600, width),
    h = height,
    m = width > 599 ? 30 : 10
  const x = scaleLinear()
      .domain(range.x)
      .nice()
      .range([m, w - m]),
    y = scaleLinear()
      .domain(range.y)
      .nice()
      .range([h - m, m])
  /*   svg = d3.create("svg")
      .attr("width", width + 20)
      .attr("height", h + 20),
    g = svg.append("g"), */

  const lines = functions.map((f) => {
    const line = []
    for (let i = m + 1e-6; i < w - m; i += 1) {
      const X = x.invert(i),
        Y = f(X),
        j = y(Y)
      line.push([i, j])
    }
    return line
  })

  return (
    <svg width={width + 20} height={h + 20}>
      <g>
        {lines.map((line, i) => (
          <path
            key={i}
            d={"M" + line.join("L")}
            stroke={colors[i] || "black"}
            strokeWidth={strokeWidth}
            fill="none"
          />
        ))}
        {/* <g transform={`translate(${m},0)`}></g> axisLeft(y) */}
        {/* <g transform={`translate(0,${y(0)})`}></g> axisBottom(x) */}
      </g>
    </svg>
  )
}
