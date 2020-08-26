import { onPre, makeZipper, preWalk, visit } from 'zippa';
import { pathTimeDuration } from './util';
import { Path } from './hierarchy';


function rhythmChildren(node) {
  return Array.isArray(node)
    ? node
    : node.parallel || node.sequential // || node.children;
}
const isBranch = (node) => !!rhythmChildren(node);

function makeNode(oldParent, children) {
  // this function will only run on branches (has children => is not a primitive)
  if (Array.isArray(oldParent)) {
    return children;
  }
  if (oldParent.parallel) {
    return { ...oldParent, parallel: children };
  }
  return { ...oldParent, sequential: children };
}

export const RhythmZipper = makeZipper(isBranch, rhythmChildren, makeNode);

export const mapLeafs = mapFn => makeZipper => preWalk(
  (node) => {
    const t = makeZipper(node);
    if (t.isLeaf()) {
      return t.edit(mapFn).item;
    }
    return node;
  }
);


// calculates fractional path for given node by looking at ancestors
export function rhythmPath(node): Path[] {
  const ancestors = (node.path?.parentItems || []).reverse();
  return [[0, 1, 1]]
  /* return ancestors.reduce((path, { children: siblings, parent, data }, i, all) => {
    if (!i) { // first ancestor is node itself => ignore
      return path;
    }
    const durations = siblings.map(({ data }) => data.duration ?? 1);
    const parentDuration = parent ? parent.data?.duration || 1 : 1;
    const index = siblings.indexOf(all[i - 1])
    const position = sum(durations.slice(0, index));
    const total = sum(durations);
    let currentPath;
    if (data.parallel) { // parallel path
      currentPath = [
        0,
        parentDuration * durations[index],
        max(durations)
      ]
    } else { // sequential path
      currentPath = [
        position,
        durations[index],
        total
      ]
    }
    return [currentPath, ...path]
  }, []); */
}

const makeReduceVisitor = fn => onPre((item, state) => {
  return ({ state: fn(state, item) })
});

export const reduce = (fn, initialAcc, z) => {
  const { state } = visit([makeReduceVisitor(fn)], initialAcc, z);
  return state;
}

// turns rhythm json to flat events with time & duration (including non leaves!)
export function renderEvents(rhythm) {
  const tree = RhythmZipper.from(rhythm);
  const { getChildren } = tree.meta;
  const rootDuration = tree.value().duration || getChildren(rhythm)?.length || 1;
  return reduce((acc, node) => {
    if (typeof node === 'object') {
      return acc;
    }
    const path: Path[] = rhythmPath(node);
    return acc.concat([{
      value: node,
      path,
      ...pathTimeDuration(path, rootDuration)
    }])
  }, [], tree)
  /*
  let flat = [];
   preWalk((node, p) => {
    const subtree = RhythmZipper.from(node);
    const path = rhythmPath(subtree);
    if (subtree.isLeaf()) {
      flat.push({
        value: node,
        path,
        ...pathTimeDuration(path, rootDuration)
      })
    }
    return node;
  }, tree) 
  console.log('flat', flat);
  return flat;
  */
}

export function test() {
  const tree = RhythmZipper.from({
    parallel: [
      ['a', 'b', 'c'],
      {
        sequential: ['d', ['e', 'f']]
      }
    ]
  });
  return mapLeafs(leaf => leaf + '4')(RhythmZipper)(tree).value();
}



/* 
const SimpleZipper = makeZipper(
  n => !!n.children?.length,
  n => n?.children,
  (parent, children) => {
    console.log('make node', parent, children)
    return { children }
  }
);

const s = SimpleZipper({
  children: [
    'a',
    { children: ['b', 'c'] }
  ]
});


console.log(s.value())
console.log(s.next().next().next().path.parentItems)


const t = mapLeafs(leaf => leaf + '4')(SimpleZipper)(s).value();

console.log(t); */
