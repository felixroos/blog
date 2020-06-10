// All this code is garbage as the features are fragmented into too many functions
// also, the feature modularity does not work without mutating the parent...

import { AgnosticChild, toObject, ValueChild, flatObject, toArray } from './helpers/objects';
import { getTimeDuration, sumDurations } from './rhythmical';
import { max } from 'd3-array';
import { NestedArray, flatArray } from './helpers/arrays';

const types = { sequential: 'sequential', parallel: 'parallel' };

export type ChildFeature<T> = (parent: ValueChild<T>) => (child: AgnosticChild<T>, i?: number) => AgnosticChild<T> | undefined;

export function ensureValue<T>(o: ValueChild<T>, type) {
  // this is mutable
  if (o[type]) {
    o.type = type;
    o.value = o[type];
    delete o[type];
  }
  return o;
}

// calculate paths is sequential fashion
export function sequentialPath<T>(parent: ValueChild<T>) {
  /* if (!isType(parent, types.sequential, true)) {
    return;
  } */
  parent = ensureValue<T>(parent, 'sequential');
  let { value: parentValue, type: parentType, path: parentPath } = parent;
  const children = (toArray(parentValue) || []);
  const duration = sumDurations(children);
  return (child: ValueChild<T>, i: number) => {
    child = ensureValue<T>(child, 'sequential');
    let path: [number, number, number];
    if (!parentType || parentType === types.sequential) {
      const position = sumDurations(children.slice(0, i))
      path = (parentPath || []).concat([
        [position, child.duration || 1, duration]
      ])
      return { ...child, path }
    }
    return child;
  }
}

// calculates paths in absolute fashion
export function parallelPath<T>(parent: ValueChild<T>) {
  /* if (!isType(parent, types.parallel)) {
    return;
  } */
  parent = ensureValue<T>(parent, 'parallel');
  let { value: parentValue, type: parentType, path: parentPath } = parent;
  const children = (toArray(parentValue) || []);
  const maxDuration = max(children.map(c => toObject(c).duration || 1));
  return (child: ValueChild<T>, i: number) => {
    child = ensureValue<T>(child, 'parallel');
    let path: [number, number, number];
    if (parentType === types.parallel) {
      path = (parentPath || []).concat([
        [0, (parent.duration || 1), maxDuration]
      ])
      return { ...child, path }
    }
    return child;
  }
}

// passes down color, can override parent color
export function colorProperty<T>(parent: ValueChild<T>) {
  let { color: parentColor } = parent;
  return (child: ValueChild<T>) => {
    if (child.color || parentColor) {
      child = { ...child, color: child.color || parentColor };
    }
    return child;
  }
}


// flatten rhythmical object format to events with features
export function flatRhythmObject<T>(agnostic: AgnosticChild<T>, features: ChildFeature<T>[] = [
  sequentialPath,
  parallelPath,
  colorProperty,
]): ValueChild<T>[] {
  return flatObject(agnostic, {
    getChildren: (agnostic: AgnosticChild<T>) => {
      let o = toObject<T>(agnostic);
      const transforms = features.map(f => f(o)).filter(t => !!t); // o is mutated here...
      let { value: parentValue } = o;
      const children = (toArray(parentValue) || []);
      return children.map((child, i) => {
        child = toObject<T>(child);
        transforms.forEach(transform => {
          child = transform(child, i)
        });
        return child;
      });
    }
  });
}


// calculate time + duration for flat events with paths
export function renderRhythmObject<T>(agnostic: AgnosticChild<T>) {
  const root = toObject(agnostic);
  const totalDuration = 1 / (root.duration || 1); // outer duration
  return flatRhythmObject(agnostic).map((event) => {
    let { path } = event;
    path = [[0, totalDuration, totalDuration]].concat(path);
    const [time, duration] = getTimeDuration(path);
    return ({ ...event, time, duration, path })
  })
}

/* export function unifyValue<T>(parent: ValueChild<T>) {
  function unifyByType(o: AgnosticChild<T>) {
    const object = toObject(o);
    ['parallel', 'sequential'].forEach(type => {
      if (object[type]) {
        object.value = o[type];
        object.type = type;
      }
    });
    return object;
  }
  let { value: parentValue, type: parentType, path: parentPath } = unifyByType(parent);
  const children = (toArray(parentValue) || []);
  const duration = sumDurations(children);
  return (child: ValueChild<T>, i: number) => {
    child = ensureValue<T>(child, 'sequential');
    let path: [number, number, number];
    if (!parentType || parentType === types.sequential) {
      const position = sumDurations(children.slice(0, i))
      path = (parentPath || []).concat([
        [position, child.duration || 1, duration]
      ])
      return { ...child, path }
    }
    return child;
  }
} */
/* export function isType<T>(child: AgnosticChild<T>, type: string, isDefault = false): boolean {
  if (typeof child !== 'object' || Array.isArray(child)) {
    return isDefault;
  }
  const _type = (child as ValueChild<T>).type;
  return _type === type || (!type && isDefault);
}
 */


// 
export function flatRhythmArray<T>(array: NestedArray<T>, whole = 1, keepPath = false) {
  return flatArray(array).map(({ value, path }) => {
    let [time, duration] = getTimeDuration(path);
    return { value, time, duration, ...(keepPath ? { path } : {}) };
  })
}

export interface MusicObject<T> {
  m?: Music<T>[] | Music<T>; // monophony
  p?: Music<T>[] | Music<T>; // polyphony
  value?: Music<T>[]; // generic
  path?: [number, number, number][];
}
export type Music<T> = T | T[] | MusicObject<T>;