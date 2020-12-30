import { Graphviz } from 'graphviz-react';
import toDot from 'jgf-dot';

export default ({ json, options }) => {
  if (!json) {
    return;
  }
  const dot = toDot(json);
  // console.log('dot',dot);
  return <Graphviz dot={dot} options={options} />;
};