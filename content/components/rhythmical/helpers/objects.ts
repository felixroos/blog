export function toObject<T>(agnostic: AgnosticChild<T>): ValueChild<T> {
  if (typeof agnostic !== 'object' || Array.isArray(agnostic)) {
    return { value: agnostic };
  }
  return agnostic;
}
export function toArray<T>(array: T /* | T[] */): T[] {
  if (!Array.isArray(array)) {
    return [array] as T[];
  }
  return array as T[];
}
export type ValueChild<T> = { value?: AgnosticChild<T>, [key: string]: any };
export type AgnosticChild<T> = ValueChild<T> | T[] | T;


export function flatObject<T>(agnostic: AgnosticChild<T>, props: FlatObjectProps<T> = {}): ValueChild<T>[] {
  const getChildren: ChildrenResolver<T> = props.getChildren || getChildrenWithPath;
  let flat: ValueChild<T>[] = [];
  const children = getChildren(agnostic, props);
  children.forEach((child) => {
    if (child.value && typeof child.value === 'object') {
      flat = flat.concat(flatObject(child, props));
    } else {
      flat.push(child);
    }
  });
  return flat;
}
export interface FlatObjectProps<T> {
  getChildren?: ChildrenResolver<T>
  [key: string]: any
}
export type ChildrenResolver<T> = (agnostic: AgnosticChild<T>, props?: FlatObjectProps<T>) => ValueChild<T>[];

export function getChildrenWithPath<T>(agnostic: AgnosticChild<T>): ValueChild<T>[] {
  let o = toObject<T>(agnostic);
  const children = (toArray(o.value) || []);
  return children.map((child, i, children) =>
    ({
      ...toObject(child), path: (o.path || []).concat([
        [i, children.length]
      ])
    })
  );
}
