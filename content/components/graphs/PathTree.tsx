import React from 'react';
import buildTree from './buildTree';
import GraphvizJSON from './GraphvizJSON';

export default function PathTree({ paths, getValue, getColor, width, height }: any) {
  const { nodes, edges } = buildTree(paths, getColor, getValue);
  return (
    <GraphvizJSON
      options={{ height: height, width: width }}
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
