import React, { useState } from 'react';
import { walk } from '../rhythmical/util';
import { useGenerator } from './useGenerator';
import Tree from '../rhythmical/components/Tree';
import Button from '@material-ui/core/Button';

export default function TreeVisitor({ tree, getChildren, onNext }) {
  getChildren = getChildren || ((node) => node.children);
  const [visited, setVisited] = useState([]);
  function getTree() {
    if (typeof tree === 'function') {
      return tree(node?.value, visited);
    }
  }
  const [node, next] = useGenerator(() => {
    setVisited([]);
    return walk(getChildren, getTree());
  }, true);
  return (
    <div>
      <Button
        onClick={() => {
          setVisited([...visited, node.value]);
          const _next = next();
          onNext?.(_next);
        }}
      >
        visit next
      </Button>
      <Tree width={620} nodeRadius={10} dx={20} columns={[12, 12]} data={getTree()} hideJson={true} />
    </div>
  );
}
