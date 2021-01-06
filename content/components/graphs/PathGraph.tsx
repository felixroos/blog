import React from 'react';
import scaleColor from '../sets/scaleColor';
import GraphvizJSON from './GraphvizJSON';

export default function PathGraph({ paths, height, getValue }) {
  if (!paths) {
    return null;
  }
  let nodes: any[] = [{ label: 'start', id: '0' }];
  let edges = [];
  const nodeId = (i, j) => `${i}.${j}`;
  // TODO: color edges of smallest path
  paths.forEach(({ path, value }, i) => {
    path.forEach((label, j) => {
      const target = nodeId(label, j);
      const match = nodes.find(({ id }) => id === target);
      if (!match) {
        nodes.push({ label, id: target, level: j, fillcolor: scaleColor(label), style: 'filled' });
      }
      if (j === 0) {
        edges.push({ source: '0', target, label: '0' });
      } else {
        const source = nodeId(path[j - 1], j - 1);
        //const diff = chromaDifference(scaleChroma(path[j - 1]), scaleChroma(label));
        const diff = getValue(path[j - 1], label);
        const isDuplicate = edges.find(({ source: s, target: t }) => source === s && target === t);

        if (j === path.length - 1) {
          edges.push({
            source,
            target,
            label: `+${diff}=${value}`,
            //fillcolor: isDuplicate ? 'yellow' : 'green',
            //style: 'filled',
          });
        } else if (!isDuplicate) {
          edges.push({
            source,
            target,
            label: `+${diff}`,
            //fillcolor: isDuplicate ? 'yellow' : 'green',
            //style: 'filled',
          });
        }
      }
    });
  });

  return (
    <GraphvizJSON
      options={{ width: 600, height: height || 800 }}
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
