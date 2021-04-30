import { getRhythmChildren, pathTimeDuration, toRhythmObject } from '../util';
import { visit } from './visit';

// TODO: polyphony

export default function renderRhythmTree(rhythm) {
  const rhythmDuration = (node) => toRhythmObject(node).duration || 1;
  const totalDuration = rhythmDuration(rhythm);
  const path = [];
  const events = [];
  for (let { node, index, isBefore, isRoot, isLeaf, siblings } of visit(getRhythmChildren, rhythm)) {
    if (!isRoot && isBefore) {
      siblings = siblings || [];
      const sumDurations = (nodes) => nodes.reduce((sum, current) => sum + rhythmDuration(current), 0);
      const time = sumDurations(siblings.slice(0, index));
      const duration = rhythmDuration(node);
      const total = time + duration + sumDurations(siblings.slice(index + 1));
      path.push([time, duration, total]);
      isLeaf && events.push({ ...toRhythmObject(node), ...pathTimeDuration(path, totalDuration) });
    } else if (!isRoot) {
      path.pop();
    }
  }
  return events;
}