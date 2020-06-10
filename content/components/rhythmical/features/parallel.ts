import { AgnosticChild, ValueChild, toObject, toArray } from '../helpers/objects';
import { max } from 'd3-array';

// unifies to {value:[],type:'parallel'} if object with type parallel
export function parallelChild<T>(agnostic: AgnosticChild<T>): AgnosticChild<T> {
  if (typeof agnostic !== 'object') { // not default
    return agnostic;
  }
  const object = agnostic as ValueChild<T>;
  if (object.type === 'parallel' || object.parallel) {
    if (object.value && object.parallel) {
      throw new Error('cannot set value together with parallel');
    }
    object.value = object.parallel || object.value;
    object.type = 'parallel';
    delete object.parallel;
  }
  return object;
}

// sets parallel paths to children if type is parallel
export function parallelParent<T>(agnostic: AgnosticChild<T>): AgnosticChild<T> {
  const _parent = parallelChild<T>(agnostic) as ValueChild<T>;
  if (typeof _parent !== 'object' || _parent.type !== 'parallel') {
    return _parent;
  }
  const parent = toObject(_parent);
  const children = toArray(parent.value || []);
  const maxDuration = max(children.map(c => toObject(c).duration || 1));
  return {
    ...parent, value: children.map((child: ValueChild<T>, i: number) => {
      child = toObject<T>(child);
      let path: [number, number, number];
      path = (parent.path || []).concat([
        [0, (parent.duration || 1), maxDuration]
      ])
      return { ...toObject(child), path }
    })
  }
}