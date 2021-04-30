import { getRhythmChildren, pathTimeDuration, rhythmFraction, toRhythmObject } from '../util';
import { visit } from './visit';

export default function renderRhythmTree(rhythm) {
  const rhythmDuration = (node) => toRhythmObject(node).duration || 1;
  const totalDuration = rhythmDuration(rhythm);
  const path = [];
  const events = [];
  for (let { node, index, isBefore, isRoot, isLeaf, siblings, parent } of visit(getRhythmChildren, rhythm)) {
    if (!isRoot && isBefore) {
      path.push(rhythmFraction(node, index, siblings, parent));
      isLeaf && events.push({ ...toRhythmObject(node), ...pathTimeDuration(path, totalDuration) });
    } else if (!isRoot) {
      path.pop();
    }
  }
  return events;
}
