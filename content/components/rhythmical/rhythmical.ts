import { AgnosticChild, flatObject, ValueChild, toObject, toArray } from './helpers/objects';
import { sequentialParent, sequentialChild } from './features/sequential';
import { parallelParent, parallelChild } from './features/parallel';
import { inheritProperty } from './features/inherit';

export type Path = [number, number, number];

export function getTimeDuration(path: Path[], whole = 1) {
  let time = 0;
  let duration = 0;
  let subdivision = whole;
  for (let i = 0; i < path.length; i++) {
    subdivision *= 1 / path[i][2];
    time += path[i][0] * subdivision;
    duration = path[i][1] * subdivision;
  }
  return [time, duration];
}

export function sumDurations<T>(children: AgnosticChild<T>[]) {
  return children.reduce((sum, child) => sum + (toObject(child).duration || 1), 0)
}

export declare type Feature<T> = (agnostic: AgnosticChild<T>) => AgnosticChild<T>

export function applyFeatures<T>(agnostic: AgnosticChild<T>, features: Feature<T>[]): AgnosticChild<T> {
  features.forEach(feature => {
    agnostic = feature(agnostic);
  });
  return agnostic;
}

// flatten rhythmical object format to events with features
export function flatRhythmObject<T>(agnostic: AgnosticChild<T>, extraFeatures: Feature<T>[] = []): ValueChild<T>[] {
  return flatObject(agnostic, {
    getChildren: (agnostic: AgnosticChild<T>) => {
      const parent = toObject(applyFeatures(agnostic, [sequentialParent, parallelParent, inheritProperty('color'), ...extraFeatures]));
      const children = (toArray(parent.value) || []);
      // we need to map children with sequentialChild/parallelChild to ensure values are set before flatObject checks them
      // => flatObject recursion would stop prematurely if children values are non objects
      // we could also include this part in sequentialParent but then we would need to cross reference features
      // => children do not necessarily use the same feature as their parent
      // so we have to split features into parent / child
      // => most features should work directly on the parent as they do not mess with the value
      return children.map((child, i) => applyFeatures(child, [sequentialChild, parallelChild]));
    }
  });
}

// calculate time + duration for flat events with paths
export function renderRhythmObject<T>(agnostic: AgnosticChild<T>, extraFeatures: Feature<T>[] = []) {
  const root = toObject(agnostic);
  const totalDuration = 1 / (root.duration || 1); // outer duration
  return flatRhythmObject(agnostic, extraFeatures).map((event) => {
    let { path } = event;
    path = [[0, totalDuration, totalDuration]].concat(path);
    const [time, duration] = getTimeDuration(path);
    return ({ ...event, time, duration, path })
  })
}


export function renderRhythm<T>(agnostic: AgnosticChild<T>, rhythmPlugins = []) {
  const root = toObject(agnostic);
  const totalDuration = 1 / (root.duration || 1); // outer duration
  return flatObject(agnostic, {
    getChildren: rhythmChildren,
    // dont stop recursion if child has parallel or sequential props
    isDeep: child => ['value', 'parallel', 'sequential'] // this spares the sequential child mess from earlier
      .reduce((deep, prop) => deep || (child[prop] && typeof child[prop] === 'object'), false),
      // apply features to children
    mapChild: renderRhythmPlugins(rhythmPlugins),
  }).map((event) => {
    let { path } = event;
    path = [[0, totalDuration, totalDuration]].concat(path);
    const [time, duration] = getTimeDuration(path);
    return ({ ...event, time, duration, path })
  })
}

function renderRhythmPlugins(rhythmPlugins = []) {
  return (props) => {
    rhythmPlugins.forEach(plugin => {
      props.child = plugin(props)
    });
    return props.child;
  }
}

function rhythmChildren<T>(agnostic: AgnosticChild<T>) {
  const parent = toObject(applyFeatures(agnostic, [sequentialParent, parallelParent]));
  const children = (toArray(parent.value) || []);
  return children;
}
