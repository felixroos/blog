import { editTree } from './editTree';
import { getRhythmChildren, makeRhythmParent, RhythmNode } from './util';

export function editRhythm<T>(rhythm: RhythmNode<T>, before?, after?) {
  let path = [];
  return editTree<RhythmNode<T>>(
    getRhythmChildren,
    makeRhythmParent,
    (r, i, _, parent) => {
      i >= 0 && path.push(i);
      return before ? before(r, path, parent) : r;
    },
    (r, i) => {
      r = after ? after(r, path, parent) : r;
      i >= 0 && path.pop();
      return r;
    },
    rhythm
  );
}
