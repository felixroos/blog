export function* visit(getChildren, tree, index?, siblings?) {
  const children = getChildren(tree) || []
  const isRoot = index === undefined;
  const isLeaf = !children?.length
  yield { node: tree, index, siblings, children, isBefore: true, isRoot, isLeaf };
  for (let i = 0; i < children.length; ++i) {
    yield* visit(getChildren, children[i], i, children)
  }
  yield { node: tree, index, siblings, children, isBefore: false, isRoot, isLeaf };
}