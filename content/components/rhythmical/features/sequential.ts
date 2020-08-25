
// unifies items to {value:[]}

import { AgnosticChild, ValueChild, toObject, toArray } from '../helpers/objects';
import { Feature, sumDurations } from '../rhythmical';

// arrays and primitives as well as objects without another type will be transformed
export function sequentialChild<T>(_item: AgnosticChild<T>): ValueChild<T> {
  const item = toObject(_item);
  if (item.type && item.type !== 'sequential') {
    return item;
  }
  if (!item.value && !item.sequential) {
    return item;
  }
  if (item.value && item.sequential) {
    throw new Error('cannot set value together with sequential');
  }
  const value = item.sequential || item.value;
  delete item.sequential;
  return { ...item, value } as ValueChild<T>;
}

// sets sequential paths for children if parent type is sequential
export function sequentialParent<T>(agnostic: AgnosticChild<T>, childFeatures: Feature<T>[] = []): AgnosticChild<T> {
  const parent = sequentialChild<T>(agnostic) as ValueChild<T>;
  if (!parent.value) {
    return parent;
  }
  const children = toArray(parent.value || []) as AgnosticChild<T>[];
  const parentDuration = (parent.duration || 1);
  // this "fix" could be a bad idea, i did it beacuse durations on sequential parents didnt work 
  // => see oye como va example in rhythmical objects post without / parentDuration
  const duration = sumDurations(children) / parentDuration;
  return {
    ...parent, value: children.map((child: AgnosticChild<T>, i: number) => {
      let path: [number, number, number];
      child = toObject<T>(child);
      const position = sumDurations(children.slice(0, i))
      path = (parent.path || []).concat([
        [position, child.duration || 1, duration]
      ])
      return { ...child, path }
    })//.map(child => applyFeatures(child, childFeatures))
  }
}