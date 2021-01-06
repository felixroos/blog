import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Switch from '@material-ui/core/Switch';
import CardContent from '@material-ui/core/CardContent';
import { Chord } from '@tonaljs/tonal';
import React, { useMemo, useState } from 'react';
import { useGenerator } from '../common/useGenerator';
import chordScales from '../sets/chordScales';
import chromaDifference from '../sets/chromaDifference';
import scaleChroma from '../sets/scaleChroma';
import scaleColor from '../sets/scaleColor';
import bestPath from './bestPath';
import PathGraph from './PathGraph';
import PathTree from './PathTree';
import { max } from 'd3-array';
import { Path } from './extendBestPath';
import Grid from '@material-ui/core/Grid';

// TODO: add json view
// TODO: button group to change view to tree | graph | json
// TODO: add undo button

export default ({ chords, scales, height, maxHeight, noScroll, getValue, keepLongerPaths, view: initialView }: any) => {
  const [view, setView] = useState(initialView);
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
  //const getDiff = getValue || combinedDiff;
  const getDiff = getValue || scaleDiff;
  const [paths, next, reset] = useGenerator(
    () => {
      return bestPath(candidates, getDiff, keepLongerPaths);
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
  /* let p = bestPath(candidates, scaleDiff);
  let r = p.next();
  while (!r.done) {
    r = p.next();
  } */
  const controls = (
    <Grid container>
      <Grid item xs={6}>
        <Button color="primary" onClick={() => !paths?.done && next()}>
          {paths?.done ? 'DONE' : 'Next Step'}
        </Button>
        <Button color="primary" onClick={() => reset()}>
          RESET
        </Button>
      </Grid>
      <Grid item xs={6}>
        <label>
          tree
          <Switch
            checked={view === 'graph'}
            color="primary"
            onChange={(e) => setView(e.target.checked ? 'graph' : 'tree')}
          />
          graph
        </label>
      </Grid>
    </Grid>
  );
  const Content = ({ height }) => (
    <>
      {view === 'tree' && <PathTree height={height} paths={paths?.value} getColor={(scale) => scaleColor(scale)} />}
      {view === 'graph' && (
        <PathGraph
          paths={paths?.value}
          height={height}
          getColor={(scale) => scaleColor(scale)}
          includeStartNode={true}
          showCalculation={true}
          showDuplicates={true}
        />
      )}
    </>
  );
  const levelHeight = 80;
  const dynamicHeight = max(paths?.value || [], (p: Path) => p.path.length + 1) * levelHeight;
  if (noScroll) {
    return (
      <>
        {controls}
        <Card elevation={3}>
          <CardContent style={{ width: '100%', overflow: 'auto', textAlign: 'center' }}>
            <Content height={height} />
          </CardContent>
        </Card>
        {dynamicHeight > 500 ? controls : <></>}
        {/* TODO: scroll to bottom when pressing bottom controls */}
      </>
    );
  }
  return (
    <>
      {controls}
      {/* <div style={{ display: 'flex' }}> */}
      <Card elevation={3}>
        <CardContent style={{ height: Math.min(dynamicHeight + 40, height), textAlign: 'center', overflow: 'auto' }}>
          <Content height={Math.min(maxHeight, dynamicHeight)} />
        </CardContent>
      </Card>
      {controls}
      {/* <ul>
          {paths?.value?.map(({ path, value }, index) => (
            <li key={index}>
              #{index}: {path.length} ({value})
            </li>
          ))}
        </ul>
      </div> */}
    </>
  );
};
