import React from "react"

export default function Spiral({
  zoom,
  width,
  height,
  spin,
  min,
  max,
  stroke,
  precision,
  strokeWidth,
  strokeLinecap,
  getRadius,
  lines,
  labels,
  fontSize,
}) {
  zoom = zoom || 1
  spin = spin || 0
  fontSize = fontSize || 10
  min = min || 0
  precision = Math.abs(precision || 1)
  strokeWidth = strokeWidth || 1
  width = width || 600
  height = height || 400
  const maxPositions = 20000
  const center = [width / 2, height / 2]
  let maxRadius = Math.sqrt(width * width + height * height) / 2
  let currentRadius = min * zoom * maxRadius
  let dots = []
  const rad = (angle) =>
    getRadius ? getRadius(angle) : angle * zoom * maxRadius

  while (
    currentRadius < maxPositions &&
    (!dots.length ||
      (Math.abs(dots[0][1]) <= maxRadius &&
        (!max || Math.abs(dots[0][0]) <= max)))
  ) {
    const angle = currentRadius / zoom / maxRadius
    dots.unshift([angle, rad(angle)])
    currentRadius += 1 / precision
  }
  if (max) {
    const lastAngle = Math.min(dots[0][0], max)
    dots[0][0] = lastAngle
    dots[0][1] = rad(lastAngle)
  }
  dots = dots.map(([angle, radius]) => {
    return spiralPosition(angle, radius, spin, ...center)
  })
  lines = (lines || []).map(([a, b, color]) => {
    return [
      spiralPosition(a, rad(a), spin, ...center),
      spiralPosition(a, rad(a + b), spin, ...center),
      color,
    ]
  })
  return (
    <>
      <svg width={width} height={height}>
        <path
          d={`M${dots.join("L")}`}
          stroke={stroke || "gray"}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap={strokeLinecap || "round"}
        />
        {(lines || []).map(([from, to, color], i) => (
          <line
            key={i}
            x1={from[0]}
            y1={from[1]}
            x2={to[0]}
            y2={to[1]}
            stroke={color || stroke || "gray"}
            strokeWidth={strokeWidth}
            strokeLinecap={strokeLinecap || "round"}
          />
        ))}
        {(labels || []).map(({ angle, label, color, fill }, i) => {
          const [x, y] = spiralPosition(angle, rad(angle), spin, ...center)
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={fontSize}
                fill={fill || stroke || "gray"}
              />
              <text
                x={x}
                y={y + fontSize / 3}
                textAnchor="middle"
                fill={color || "white"}
                style={{ fontSize }}
              >
                {label}
              </text>
            </g>
          )
        })}
      </svg>
    </>
  )
}

export function spiralPosition(
  angle,
  radius,
  spin = 0,
  cx = radius,
  cy = radius
): [number, number] {
  return [
    Math.sin((spin - angle + 0.5) * Math.PI * 2) * radius + cx,
    Math.cos((spin - angle + 0.5) * Math.PI * 2) * radius + cy,
  ]
}
