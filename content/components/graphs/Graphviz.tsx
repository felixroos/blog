import * as React from 'react';
import toDot from 'jgf-dot';
import canUseDOM from '../../components/canUseDOM';

canUseDOM() && document.write('<script src="https://cdn.jsdelivr.net/npm/@hpcc-js/wasm/dist/index.min.js"><' + '/script>');

export function Graph({ json, editable }: any) {
  const [el, setEl] = React.useState<HTMLDivElement>();
  const [value, setValue] = React.useState<string>(JSON.stringify(json, null, 2));
  const renderGraph = async (jsonString) => {
    if (!window?.['@hpcc-js/wasm'] || !el) {
      return;
    }
    try {
      const { graphviz } = window['@hpcc-js/wasm'];
      const dot = toDot(JSON.parse(jsonString));
      const svg = await graphviz.layout(dot, 'svg', 'dot');
      el.innerHTML = svg;
    } catch (error) {
      console.log('invalid..');
    }
  };
  React.useEffect(() => {
    renderGraph(value);
  }, [window['@hpcc-js/wasm'], el, value]);
  return (
    <>
      <div ref={(e) => setEl(e)}></div>
      {editable && (
        <textarea style={{ width: '100%', height: '600px' }} value={value} onChange={(e) => setValue(e.target.value)} />
      )}
    </>
  );
}
