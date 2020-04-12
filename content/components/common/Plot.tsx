import React from "react"
import { scaleLinear } from "d3-scale"

export function PlotPath({ f }) {}

export function Plot({
  strokeWidth,
  functions,
  width,
  height,
  range,
  colors,
  grid,
  onHover,
  onClick,
}: any) {
  width = width || 600
  height = height || 600
  strokeWidth = strokeWidth || 1
  colors = colors || []
  functions = functions || []
  const w = width,
    h = height,
    m = 10

  const x = scaleLinear()
      .domain(range.x)
      .range([m, w - m]),
    y = scaleLinear()
      .domain(range.y)
      .range([h - m, m])
      .nice()

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
    <svg
      width={w + m * 2}
      height={h + m * 2}
      onClick={(e) => onClick && onClick(e)}
    >
      {grid && grid.x && (
        <g>
          {Array.from(
            { length: Math.floor((range.x[1] - range.x[0]) / grid.x) + 1 },
            (_, i) => (
              <line
                key={`grid-x-${i}`}
                x1={x(i * grid.x)}
                x2={x(i * grid.x)}
                y1={y(range.y[0])}
                y2={y(range.y[1])}
                stroke="gray"
                strokeWidth={1}
              />
            )
          )}
        </g>
      )}
      {grid && grid.y && (
        <g>
          {Array.from(
            { length: Math.floor((range.y[1] - range.y[0]) / grid.y) + 1 },
            (_, i) => (
              <line
                key={`grid-y-${i}`}
                x1={x(range.x[0])}
                x2={x(range.x[1])}
                y1={y(range.y[0] + i * grid.y)}
                y2={y(range.y[0] + i * grid.y)}
                stroke="gray"
                strokeWidth={1}
              />
            )
          )}
        </g>
      )}
      <g>
        {lines.map((line, i) => (
          <path
            onMouseEnter={() => onHover && onHover(i)}
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
