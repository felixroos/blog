import React from 'react';
import buildTree from './buildTree';
import GraphvizJSON from './GraphvizJSON';

export default function PathTree({ paths, getColor, getValue, width, height }: any) {
  const { nodes, edges } = buildTree(paths || [], getColor, getValue);
  return (
    <GraphvizJSON
      options={{ height, width }}
      json={{
        graph: {
          directed: true,
          nodes,
          edges,
        },
      }}
    />
  );
}
