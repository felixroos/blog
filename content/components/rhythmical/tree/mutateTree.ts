export function* mutateTree(getChildren, tree, mutateFn, index?, siblings?, parent?) {
  tree = mutateFn(tree);
  const children = getChildren(tree) || []
  const isRoot = parent === undefined;
  const isLeaf = !children?.length
  yield { node: tree, index, siblings, children, isBefore: true, isRoot, isLeaf, parent };
  for (let i = 0; i < children.length; ++i) {
    yield* mutateTree(getChildren, children[i], mutateFn, i, children, tree)
  }
  // yield* children.map((child, i) => mutateTree(getChildren, child, mutateFn, i, children, tree));
  yield { node: tree, index, siblings, children, isBefore: false, isRoot, isLeaf, parent };
}