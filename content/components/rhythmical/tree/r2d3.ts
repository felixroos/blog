import { editTree } from './editTree';
import { getRhythmChildren, RhythmNode } from '../util';

// r2d3 = rhythm to d3 => map rhythmical object to d3-hierarchy format
export function r2d3<T>(rhythm: RhythmNode<T>, mapFn?) {
  let path = [];
  return editTree<RhythmNode<T>>(
    getRhythmChildren,
    (r, children) => ({
      name: 'parent',
      children,
      ...r,
    }),
    (r, i, children, parent) => {
      i !== undefined && path.push([i, children.length]);
      if (mapFn) {
        r = mapFn(r, path, parent);
      }
      return r;
    },
    (r, i) => {
      i !== undefined && path.pop();
      return r;
    },
    rhythm
  );
}
