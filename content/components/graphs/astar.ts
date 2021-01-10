import { minIndex } from 'd3-array';
declare type NodeID = string;
declare type Connection = [source: NodeID | null, target: NodeID, value: number, h?: number];
export declare type Target = [target: NodeID, value: number, h?: number];

// TODO: use h distance

export default function astar(
  startNodes: NodeID[],
  endNodes: NodeID[],
  getTargets: (source: NodeID) => Target[]
): any[] {
  let open: Connection[] = startNodes.map(node => [null, node, 0]);
  const closed: Connection[] = [];
  let winner;
  let count = 0;
  while (!winner) {
    count++;
    const getValue = (o) => o[2]; // + (o[3] || 0);
    const bestIndex = minIndex(open, getValue);
    const best = open[bestIndex];
    closed.push(best);
    winner = closed.find((c) => endNodes.includes(c[1]));
    if (winner) {
      return traceWinner();
    }
    const [_, newSource, distance] = best;
    const connections: Connection[] = getTargets(newSource)
      .map(([target, value, h]): Connection => [newSource, target, distance + value, h])
    open = [
      ...open.slice(0, bestIndex),
      ...connections,
      ...open.slice(bestIndex + 1)
    ].filter(c => !closed.find(([_, target, v]) => target === c[1] && getValue(c) >= v))
  }
  function traceWinner() {
    const path = winner.slice(0, 2);
    if (!path[0]) {
      return [path[1]];
    }
    while (!startNodes.includes(path[0])) {
      const prev = closed.find((c) => c[1] === path[0]);
      path.unshift(prev[0]);
    }
    return path;
  }
}
