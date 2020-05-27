import React from 'react';
import { select } from 'd3-selection';
import { cluster, hierarchy } from 'd3-hierarchy';
import { NestedArray } from './rhythmical';

export default function RhythmicalTree(props) {
  let { width = 600, height = 200, rhythm } = props;
  const root: any = tree(rhythm, width);
  return (
    <svg
      viewBox={`-10 ${-height / 2} ${width} ${height}`}
      ref={(el) => {
        const svg = select(el);
        // lines
        svg
          .append('g')
          .attr('fill', 'none')
          .attr('stroke', '#555')
          .attr('stroke-opacity', 0.4)
          .attr('stroke-width', 1.5)
          .selectAll('path')
          .data(root.links())
          .join('path')
          .attr(
            'd',
            (d: any) => `
        M${d.target.y},${d.target.x}
        C${d.source.y + root.dy / 2},${d.target.x}
         ${d.source.y + root.dy / 2},${d.source.x}
         ${d.source.y},${d.source.x}`
          );
        // circles
        svg
          .append('g')
          .selectAll('circle')
          .data(root.descendants())
          .join('circle')
          .attr('cx', (d: any) => d.y)
          .attr('cy', (d: any) => d.x)
          .attr('fill', (d: any) => (d.children ? '#555' : '#999'))
          .attr('r', 2.5);
        // labels
        svg
          .append('g')
          .attr('font-family', 'sans-serif')
          .attr('font-size', 10)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-width', 3)
          .selectAll('text')
          .data(root.descendants())
          .join('text')
          .attr('x', (d: any) => d.y)
          .attr('y', (d: any) => d.x)
          .attr('dy', '0.31em')
          .attr('dx', (d: any) => (d.children ? -6 : 6))
          .text((d: any) => d.data.name)
          .filter((d: any) => d.children)
          .attr('text-anchor', 'end')
          .clone(true)
          .lower()
          .attr('stroke', 'white');
        // svg.attr('viewBox', autoBox as any);
      }}
    />
  );
}

export function tree(rhythm, width = 600) {
  const root: any = hierarchy(
    rhythmicalHierarchy(rhythm)
  ); /* .sort(
    (a, b) =>
      descending(a.height, b.height) || ascending(a.data.name, b.data.name)
  ); */
  root.dx = 10;
  root.dy = width / (root.height + 1);
  return cluster().nodeSize([root.dx, root.dy])(root);
}

export function rhythmicalHierarchy<T>(rhythm: NestedArray<T>) {
  return {
    children: rhythm.map((n) => {
      if (Array.isArray(n)) {
        return rhythmicalHierarchy(n);
      }
      return { name: n };
    })
  };
}