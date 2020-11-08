import { Fraction, getRhythmChildren, isRhythmLeaf, pathTimeDuration, RhythmEvent, rhythmFraction, RhythmNode, rhythmValue } from './util';
import { visitTree } from './visitTree';

export function rhythmEvents<T>(rhythm: RhythmNode<T>): RhythmEvent<T>[] {
  const path: Fraction[] = [];
  const events: RhythmEvent<T>[] = [];
  visitTree(
    rhythm,
    (t, i, children, parent) => {
      const fraction = rhythmFraction(t, i, children, parent);
      path.push(fraction)
      if (isRhythmLeaf(t)) {
        events.push({ value: rhythmValue(t),/*  path, */ ...pathTimeDuration(path) })
      }
    },
    (_, i) => path.pop(),
    (node) => getRhythmChildren(node)
  );
  return events;
}