import { line } from "d3-shape"
import React from "react"
import { max } from "d3-array"
import { useHover } from "react-use-gesture"

export declare type NodeIdentifier = "string" | number
export declare type Node = {
  id: NodeIdentifier
  value: number
  fill?: string
  label: string
  distance?: number
  radius?: number
}
export declare type Link<T> = {
  source: NodeIdentifier
  target: NodeIdentifier
  value?: T
  stroke?: string
  strokeWidth?: number
}
export declare type Set = {
  set: NodeIdentifier[]
  stroke?: string
}

export default function ConnectedCircle({
  nodes,
  links,
  sets,
  size,
  r,
  nodeRadius,
  onClick,
  onHover,
}: {
  nodes: Node[]
  links?: Link<any>[]
  sets?: Set[]
  r: number
  nodeRadius: number
  size: number
  onClick?: (item: { link?: Link<any>; set?: Set; node?: Node }) => void
  onHover?: (item: { link?: Link<any>; set?: Set; node?: Node }) => void
}) {
  nodeRadius = nodeRadius || 20
  const radius = r || 100
  const maxDistance = max(nodes.map((n) => n.distance).concat([radius]))
  const maxRadius = max(nodes.map((n) => n.radius).concat([nodeRadius]))
  size = size || maxDistance * 2 + maxRadius * 2

  function nodePosition(id: NodeIdentifier, r?: number): [number, number] {
    const node = nodes.find(({ id: _id }) => _id === id)
    if (!node) {
      console.error(`node ${id} not found`)
    }
    const distance = r || node.distance || radius
    const value =
      typeof node.value !== "undefined"
        ? node.value
        : nodes.indexOf(node) / nodes.length
    const [x, y] = circlePosition(value, distance)
    return [
      x + nodeRadius + maxDistance - distance,
      y + nodeRadius + maxDistance - distance,
    ]
  }

  const hover = useHover(({ args: [item], active }) => {
    onHover && onHover(active ? item : {})
  })

  return (
    <svg width={size} height={size}>
      <circle
        cx={maxDistance + nodeRadius}
        cy={maxDistance + nodeRadius}
        r={radius}
        stroke="gray"
        strokeWidth={2}
        fill="none"
      />
      {links &&
        links.map((link, i) => {
          const { source, target, stroke, strokeWidth } = link
          return (
            <path
              onClick={() => onClick && onClick({ link })}
              {...hover({ link })}
              key={i}
              stroke={stroke || "gray"}
              strokeWidth={strokeWidth || 4}
              fill="none"
              d={line()([source, target].map((id): any => nodePosition(id)))}
            />
          )
        })}

      {sets &&
        sets.map((_set, i) => {
          const { set, stroke } = _set
          return (
            <path
              onClick={() => onClick && onClick({ set: _set })}
              {...hover({ set: _set })}
              key={i}
              stroke={stroke || "gray"}
              strokeWidth={4}
              fill="none"
              d={line()(set.map((node) => nodePosition(node)))}
            />
          )
        })}

      {nodes.map((node, i, a) => {
        const { id, label, fill, radius: _radius } = node
        const [x, y] = nodePosition(id)
        // tick position
        const [tx, ty] = nodePosition(id, radius)
        return (
          <React.Fragment key={i}>
            <path
              onClick={() => onClick && onClick({ node })}
              {...hover({ node })}
              strokeWidth={2}
              stroke={"gray"}
              d={line()([
                [tx, ty],
                [x, y],
              ])}
            />
            <circle r={_radius || nodeRadius} cx={x} cy={y} fill={fill} />
            <text
              style={{ userSelect: "none", pointerEvents: "none" }}
              x={x}
              y={y + nodeRadius / 4}
              fill="black"
              textAnchor="middle"
            >
              {typeof label !== "undefined" ? label : id}
            </text>
          </React.Fragment>
        )
      })}
    </svg>
  )
}

export function circlePosition(fraction, radius): [number, number] {
  return [
    /* Math.round( */ radius +
      Math.sin(fraction * Math.PI * 2) * radius /* ) */,
    /* Math.round( */ radius -
      Math.cos(fraction * Math.PI * 2) * radius /* ) */,
  ]
}
