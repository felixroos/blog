import { minIndex } from 'd3-array';

declare type Path = {
  values: number[],
  value: number,
  path: string[]
}

declare type ValueFn = (path: Path, target: string,) => number;

export default function extendBestPath(paths: Path[], candidates: string[][], getValue: ValueFn) {
  if (!paths.length) {
    return candidates[0].map(candidate => ({ value: 0, values: [0], path: [candidate] }))
  }
  const bestIndex = minIndex(paths, (path) => path.value);
  const best = paths[bestIndex];
  if (best.path.length >= candidates.length) {
    throw new Error('cannot extendBestPath: graph end reached')
  }
  const nextCandidates: Path[] = candidates[best.path.length].map(candidate => {
    const value = getValue(best, candidate);
    return {
      value: best.value + value,
      values: best.values.concat([value]),
      path: best.path.concat(candidate)
    }
  });
  return [...paths.slice(0, bestIndex), ...nextCandidates, ...paths.slice(bestIndex + 1)]
}