import { reduceHierarchy, StateDigger, StateMutator, StateReducer } from './reduceHierarchy';
import { getRhythmChildren, pathTimeDuration, rhythmFraction, RhythmNode } from './util';

// this seems to be old..

declare interface RhythmShovel<T> {
  node: RhythmNode<T>,
  events: Array<{ value: RhythmNode<T>, path?: number[][], time: number, duration: number }>,
  path: number[][],
};

declare type RhythmicalPlugin<T> = [
  StateDigger<RhythmShovel<T>>, // resolves children states
  StateMutator<RhythmShovel<T>>, // runs on each state before accessing children
  StateReducer<RhythmShovel<T>>, // runs on each child state before going deeper
  StateReducer<RhythmShovel<T>>,
]

const rhythmicalBase: RhythmicalPlugin<string> = [
  function dig({ node, ...state }) {
    return getRhythmChildren(node)?.map(child => ({ ...state, node: child }));
  },
  function mutate(state) {
    // here we can modify the current state to e.g. generate children
    return state;
  },
  function before(parentState, childState, index, childStates) {
    // this function runs before the child has been processed
    // => here we can pass data down to the children
    let { node: parent, events, path } = parentState;
    let { node } = childState;
    const siblings = childStates.map(({ node }) => node);
    // we need to extend the path here to make it available for the childs children
    return {
      ...childState, events,
      path: path.concat([
        rhythmFraction(node, index, siblings, parent)
      ])
    };
  },
  function after(parentState, childState) {
    // this function runs after the child has been processed
    // => here the child already ran through "before" + "mutate"
    let { events, node, path } = childState;
    const children = getRhythmChildren(node);
    if (!children) { // is Leaf
      events = events.concat([
        { value: node, path, ...pathTimeDuration(path) }
      ])
    }
    return { ...parentState, events } // only pass on values
  }
]



export function digRhythm(tree: RhythmNode<string>, edit?: StateMutator<RhythmShovel<string>>) {
  const [digger, mutate, before, after] = rhythmicalBase;

  return reduceHierarchy<RhythmShovel<string>>(
    digger,
    edit || mutate,
    before,
    after,
    {
      node: tree,
      events: [],
      path: [rhythmFraction(tree)] // start with root fraction = [0,duration,1]
    }
  ).events
}
