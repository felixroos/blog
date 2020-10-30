import { sum, max } from 'd3-array';

export declare interface RhythmObject<T> {
  value?: T,
  path?: Path,
  sequential?: RhythmNode<T>[],
  parallel?: RhythmNode<T>[],
  duration?: number,
} // TBD: convert from "option bag" to union: ParallelRhythm | SequentialRhythm | LeafRhythm
export declare interface RhythmLeaf<T> extends RhythmObject<T> {
  value: T
}

export declare type RhythmNode<T> = T | T[] | RhythmNode<T>[] | RhythmObject<T>;
export declare type Fraction = number[];
export declare type Path = Fraction[];
export declare type RhythmEvent<T> = {
  value: T, path?: Path, time?: number, duration?: number
}

// returns fraction of a node, based on sibling durations (path = fraction[])
export function rhythmFraction<T>(
  node: RhythmNode<T>,
  index?: number,
  siblings?: RhythmNode<T>[],
  parent?: RhythmNode<T>
): Fraction {
  const duration = (node as RhythmObject<T>).duration ?? 1;
  if (!parent) {
    // root node
    return [0, duration, 1]
  }
  const durations = siblings.map((sibling: RhythmObject<T>) => sibling.duration ?? 1);
  const position = sum(durations.slice(0, index));
  const total = sum(durations);
  if ((parent as RhythmObject<T>)?.parallel) {
    // parallel path
    return [0, duration, max(durations)];
  }
  // sequential path
  return [position, duration, total]
}

// returns time duration from path array (array of fractions)
export function pathTimeDuration(path: Path, whole = 1): { time: number, duration: number } {
  let time = 0;
  let duration = whole;
  for (let i = 0; i < path.length; i++) {
    time = time + path[i][0] / path[i][2] * duration
    duration *= path[i][1] / path[i][2];
  }
  return { time, duration };
}


// returns array of children for a rhythm object (if any)
export function getRhythmChildren<T>(node: RhythmNode<T>): RhythmNode<T>[] {
  return Array.isArray(node)
    ? node
    : (node as RhythmObject<T>)?.parallel || (node as RhythmObject<T>)?.sequential
}

// enforces type object
export function toRhythmObject<T>(child: RhythmNode<T>): RhythmObject<T> {
  if (typeof child !== 'object') {
    return {
      value: child
    }
  }
  if (Array.isArray(child)) {
    return {
      sequential: child
    }
  }
  return child as RhythmObject<T>;
}

// emits new object for parent + children
export function makeRhythmParent<T>(oldParent: RhythmObject<T> | RhythmNode<T>[], children: RhythmNode<T>[]): RhythmNode<T>[] | RhythmObject<T> {
  if (Array.isArray(oldParent)) {
    return children;
  }
  if (oldParent.parallel) {
    return { ...oldParent, parallel: children };
  }
  return { ...oldParent, sequential: children };
}

// convenience function to call a function on the value of either object or primitive
export function editLeafValue<T>(fn: (value: T) => T) {
  return (leaf: RhythmNode<T>) => {
    // a leaf is not an array..
    if (typeof leaf === 'object') {
      return {
        ...leaf,
        value: fn((leaf as RhythmObject<T>).value)
      }
    }
    return fn(leaf);
  }
}

declare type MapRhythmFn<T> = (rhythm: RhythmNode<T>, state?: any) => [RhythmNode<T>, any];

/// EXPERIMENTAL SECTION

export function mapRhythm<T>(mapFn: MapRhythmFn<T>, rhythm: RhythmNode<T>, state?: any) {
  [rhythm, state] = mapFn(rhythm, state);
  const children = getRhythmChildren(rhythm);
  if (!children) {
    return rhythm;
  }
  return makeRhythmParent(rhythm, children.map(child => mapRhythm(mapFn, child, state)))
}


///

declare type ChildrenGetter<S> = (hierarchy: S) => S[];
declare type ParentFactory<S> = (hierarchy: S, children: S[]) => S;
declare type NodeMapFn<S> = (hierarchy: S, index: number, siblings?: S[]) => S;

export function mapHierarchy<S>(
  getChildren: ChildrenGetter<S>,
  makeParent: ParentFactory<S>,
  mapFn: NodeMapFn<S>,
  hierarchy: S,
  index?: number,
  siblings?: S[]
) {
  hierarchy = mapFn(hierarchy, index, siblings);
  const children = getChildren(hierarchy);
  if (!children?.length) {
    return hierarchy;
  }
  return makeParent(
    hierarchy,
    children.map((...args) => mapHierarchy(getChildren, makeParent, mapFn, ...args))
  );
}

function rhythmTreeChildren<T, S>({ data, ...props }: { data: RhythmNode<T> } & S) {
  return getRhythmChildren<T>(data)?.map(child => ({ data: child, ...props }));
}
function rhythmTreeParent<T, S>({ data, ...props }: { data: RhythmNode<T> } & S, children: Array<{ data: RhythmNode<T> } & S>) {
  return {
    data: makeRhythmParent(data, children.map(({ data }) => data)),
    ...props
  };
}

// TODO maybe write mapRhythm without the abstract mapHierarchy to get better typing results..

export function addColors<T>(rhythm: RhythmNode<T>, scheme: string[]) {
  const { data } = mapHierarchy<{
    data: RhythmNode<T>,
    path: number[][],
  }>(
    rhythmTreeChildren,
    rhythmTreeParent,
    ({ data, path }, index, children) => {
      if (children) {
        path = path.concat([[index, children.length]]);
      }
      const color = path?.length ? scheme[path.length - 1] : 'black';
      return { data: { ...toRhythmObject(data), color }, path }
    },
    { data: rhythm, path: [] });
  return data;
}

export function colorize<T>(rhythm: RhythmNode<T>, scheme: string[]) {
  return mapRhythm((node, path = []) => {
    const children = getRhythmChildren(node);
    node = toRhythmObject(node);
    return [
      { color: path.length ? scheme[path.length - 1] : 'black', ...node, },
      path.concat(children?.length ? [children.indexOf(node)] : []),
    ];
  }, rhythm)
}

export function pathString(path: [number, number, number][]) {
  return path.map(p => p.join(':')).join(' ');
}
