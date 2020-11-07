import React from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import * as treeify from 'treeify';
import { r2r } from '../rhythmical/util';

export function AsciiTreeDiff({ before, edit }) {
  return <ReactDiffViewer oldValue={treeify.asTree(before, true)} newValue={treeify.asTree(edit(before), true)} />;
}
