import React from 'react';
import buildGraph from './buildGraph';
import GraphvizJSON from './GraphvizJSON';

export default function PathGraph({ paths, width, height, ...options }: any) {
  const { nodes, edges } = buildGraph(paths, options);
  return (
    <GraphvizJSON
      options={{ width, height }}
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
