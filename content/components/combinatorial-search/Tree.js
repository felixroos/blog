import React, { useEffect, useRef, useState } from "react"

import canUseDOM from "../canUseDOM"
let Tree

if (canUseDOM()) {
  const ReactD3Tree = require("react-d3-tree")
  Tree = ReactD3Tree.default
}

function countLeafs(data, count = 0) {
  if (data.children.length) {
    return data.children.reduce((sum, child) => sum + countLeafs(child), 0)
  }
  return 1
}

export function MyTree({ data }) {
  const treeContainer = useRef()
  const [leafCount, setLeafCount] = useState(1)
  const height = 500
  const width = 900
  const ballHeight = 50
  const padding = 30

  useEffect(() => {
    if (data) {
      const leafs = countLeafs(data)
      setLeafCount(leafs)
    }
  }, [data])

  const totalHeight = leafCount * ballHeight
  return (
    <div style={{ height: 400, width: "100%", overflow: "auto" }}>
      <div
        id="treeWrapper"
        style={{
          width,
          height: totalHeight + padding,
          backgroundColor: "transparent",
          borderRadius: "10px",
        }}
        ref={treeContainer}
      >
        {Tree && (
          <Tree
            translate={{ x: padding, y: totalHeight / 2 + padding }}
            zoom={1}
            data={data}
            transitionDuration={0}
            styles={{
              links: {
                stroke: "gray",
                strokeWidth: 3,
              },
            }}
            zoomable={false}
            separation={{ siblings: 0.35, nonSiblings: 0.35 }}
            orientation="horizontal"
            pathFunc="straight"
          />
        )}
      </div>
    </div>
  )
}
