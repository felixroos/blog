import { toArray, toObject, AgnosticChild } from '../helpers/objects';

export function inheritProperty<T>(property) {
  return (_parent: AgnosticChild<T>): AgnosticChild<T> => {
    const parent = toObject(_parent);
    if (!parent[property] || !parent.value) {
      return parent;
    }
    return {
      ...parent, value: (toArray(parent.value)).map(child => {
        const childObj = toObject(child);
        return { ...childObj, [property]: childObj[property] || parent[property] }
      })
    }
  }
}
