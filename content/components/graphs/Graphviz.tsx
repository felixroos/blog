import * as React from 'react';
import toDot from 'jgf-dot';

import { graphviz } from '@hpcc-js/wasm';

// to make this work, make sure to copy graphvizlib.wasm to static with:
// cp ./node_modules/@hpcc-js/wasm/dist/graphvizlib.wasm ./static

export function Graph({ json, editable }: any) {
  const [el, setEl] = React.useState<HTMLDivElement>();
  const [value, setValue] = React.useState<string>(JSON.stringify(json, null, 2));
  const renderGraph = async (jsonString) => {
    if (!el) {
      return;
    }
    try {
      const dot = toDot(JSON.parse(jsonString));
      const svg = await graphviz.layout(dot, 'svg', 'dot');
      el.innerHTML = svg;
    } catch (error) {
      console.log('invalid..');
    }
  };
  React.useEffect(() => {
    renderGraph(value);
  }, [el, value]);
  return (
    <>
      <div ref={(e) => setEl(e)}></div>
      {editable && (
        <textarea style={{ width: '100%', height: '600px' }} value={value} onChange={(e) => setValue(e.target.value)} />
      )}
    </>
  );
}
