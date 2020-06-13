import React from 'react';
import canUseDOM from '../canUseDOM';
const ReactJson = canUseDOM() ? require('react-json-view').default : null;

export default function JSONViewer({ json, collapsed }: any) {
  return ReactJson ? (
    <ReactJson collapsed={collapsed ?? true} src={json} theme="monokai" />
  ) : (
    <>not a browser</>
  );
}
