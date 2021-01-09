import { minIndex } from 'd3-array';
declare type NodeID = string;
declare type Connection = [value: number, source: NodeID | null, target: NodeID];
export declare type Target = [target: NodeID, value: number, h?: number];

// TODO: use h distance

export default function astar(
  startNodes: NodeID[],
  endNodes: NodeID[],
  getConnections: (node: NodeID) => Target[]
): any[] {
  let open: Connection[] = startNodes.map(node => [0, null, node]);
  const closed: Connection[] = [];
  let winner;
  while (!winner) {
    const bestIndex = minIndex(open, ([value]) => value);
    const best = open[bestIndex];
    closed.push(best);
    winner = closed.find((c) => endNodes.includes(c[2]));
    if (winner) {
      return traceWinner();
    }
    const [distance, _, newSource] = best;
    const connections: Connection[] = getConnections(newSource)
      .map(([target, value]) => [distance + value, newSource, target]);
    open = [
      ...open.slice(0, bestIndex),
      ...connections,
      ...open.slice(bestIndex + 1)
    ]
  }
  function traceWinner() {
    const path = winner.slice(1);
    if (!path[0]) {
      return [path[1]];
    }
    while (!startNodes.includes(path[0])) {
      const prev = closed.find((c) => c[2] === path[0]);
      path.unshift(prev[1]);
    }
    return path;
  }
}

