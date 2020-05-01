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
}) {
  zoom = zoom || 1
  spin = spin || 0
  min = min || 0
  precision = Math.abs(precision || 1)
  strokeWidth = strokeWidth || 1
  width = width || 600
  height = height || 400
  const maxPositions = 20000
  const center = [width / 2, height / 2]
  let maxRadius = Math.sqrt(width * width + height * height) / 2
  let i = min * zoom * maxRadius
  let dots = []
  while (
    i < maxPositions &&
    (!dots.length ||
      (Math.abs(dots[0][1]) <= maxRadius &&
        (!max || Math.abs(dots[0][0]) <= max)))
  ) {
    const angle = i / zoom / maxRadius
    let radius = getRadius ? getRadius(angle) : i
    dots.unshift([angle, radius])
    i += 1 / precision
  }
  dots = dots.map(([angle, radius]) => {
    return spiralPosition(angle, radius, spin, ...center)
  })
  return (
    <>
      <svg width={width} height={height}>
        <path
          d={`M${dots.join("L")}`}
          stroke={stroke || "white"}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap={strokeLinecap || "round"}
        />
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
    Math.sin((spin + angle) * Math.PI * 2) * radius + cx,
    Math.cos((spin + angle) * Math.PI * 2) * radius + cy,
  ]
}
