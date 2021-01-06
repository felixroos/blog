import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Chord } from '@tonaljs/tonal';
import React, { useMemo } from 'react';
import { useGenerator } from '../common/useGenerator';
import chordScales from '../sets/chordScales';
import chromaDifference from '../sets/chromaDifference';
import scaleChroma from '../sets/scaleChroma';
import scaleColor from '../sets/scaleColor';
import buildGraph from './buildGraph';
import PathGraph from './PathGraph';
import PathTree from './PathTree';
import { max } from 'd3-array';
import { Path } from './extendBestPath';

// TODO: add json view
// TODO: button group to change view to tree | graph | json
// TODO: add undo button

export default ({ chords, scales, height, maxHeight, noScroll, getValue, keepLongerPaths, view }: any) => {
  view = view || 'tree';
  height = height || 800;
  maxHeight = maxHeight || 800;
  const candidates = useMemo(
    () =>
      chords.map((chord) => {
        const root = Chord.tokenize(chord)[0];
        return chordScales(chord, scales).map((scale) => `${root} ${scale}`);
      }),
    [chords, scales]
  );
  const scaleDiff = (source, target) =>
    source && target ? chromaDifference(scaleChroma(source), scaleChroma(target)) : 0;
  const colorDiff = (source, target) => {
    return source && scaleChroma(source) !== scaleChroma(target) ? 1 : 0;
  };
  const combinedDiff = (source, target) => {
    return colorDiff(source, target) + scaleDiff(source, target);
  };
  const getDiff = getValue || combinedDiff;
  const [paths, next, reset] = useGenerator(
    () => {
      return buildGraph(candidates, getDiff, keepLongerPaths);
    },
    true,
    false
  );
  /* useEffect(() => {
    setInterval(() => {
      if (paths && !paths.done) {
        next();
      }
    }, 200);
  }, []); */
  /* let p = buildGraph(candidates, scaleDiff);
  let r = p.next();
  while (!r.done) {
    r = p.next();
  } */
  const controls = (
    <>
      <Button color="primary" onClick={() => !paths?.done && next()}>
        {paths?.done ? 'DONE' : 'Next Step'}
      </Button>
      <Button color="primary" onClick={() => reset()}>
        RESET
      </Button>
    </>
  );
  if (noScroll) {
    const levelHeight = 80;
    const dynamicHeight = max(paths?.value || [], (p: Path) => p.path.length + 1) * levelHeight;
    return (
      <>
        {controls}
        <Card elevation={3}>
          <CardContent style={{ width: '100%', overflow: 'auto', textAlign: 'center' }}>
            {view === 'tree' && <PathTree paths={paths?.value} getColor={(scale) => scaleColor(scale)} />}
            {view === 'graph' && <PathGraph paths={paths?.value} height={height} getValue={getDiff} />}
          </CardContent>
        </Card>
      </>
    );
  }
  return (
    <div>
      {controls}
      {/* <div style={{ display: 'flex' }}> */}
      <Card elevation={3}>
        <CardContent style={{ height: height, overflow: 'auto' }}>
          {view === 'tree' && (
            <PathTree height={maxHeight} paths={paths?.value} getColor={(scale) => scaleColor(scale)} />
          )}
          {view === 'graph' && <PathGraph paths={paths?.value} height={maxHeight} getValue={getDiff} />}
        </CardContent>
      </Card>
      {/* <ul>
          {paths?.value?.map(({ path, value }, index) => (
            <li key={index}>
              #{index}: {path.length} ({value})
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};
