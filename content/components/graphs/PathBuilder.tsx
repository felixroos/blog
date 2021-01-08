import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Switch from '@material-ui/core/Switch';
import CardContent from '@material-ui/core/CardContent';
import { Chord } from '@tonaljs/tonal';
import React, { useEffect, useMemo, useState } from 'react';
import { useGenerator } from '../common/useGenerator';
import chordScales from '../sets/chordScales';
import chromaDifference from '../sets/chromaDifference';
import scaleChroma from '../sets/scaleChroma';
import scaleColor from '../sets/scaleColor';
import bestPath from './generateBestPath';
import PathGraph from './PathGraph';
import PathTree from './PathTree';
import { max } from 'd3-array';
import { Path } from './extendBestPath';
import Grid from '@material-ui/core/Grid';

// TODO: add json view
// TODO: button group to change view to tree | graph | json
// TODO: add undo button
// TODO: find out why width sometimes is too big

export default ({
  chords,
  scales,
  width,
  height,
  maxHeight,
  noScroll,
  getValue,
  keepLongerPaths,
  onlyKeepWinner,
  view: initialView,
  interval,
}: any) => {
  const [view, setView] = useState(initialView);
  const [tolerance, setTolerance] = useState(0);
  const [nextInterval, setNextInterval] = useState<any>();
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
  const distance = (source, target, { path }) => {
    // this seems to not always find the best path...
    return chords.length - path.length; // adds distance to goal => checks nearer paths first
  };
  const combinedDiff = (source, target, path) => {
    return colorDiff(source, target) + scaleDiff(source, target) /* + distance(source, target, path) */;
  };
  const getDiff = getValue || combinedDiff;
  // const getDiff = getValue || scaleDiff;
  const [started, setStarted] = useState(false);
  const [paths, nextValue, resetGenerator] = useGenerator(
    () => {
      return bestPath(candidates, getDiff, { keepLongerPaths, tolerance, onlyKeepWinner });
    },
    true,
    false
  );
  useEffect(() => {
    if (interval && !nextInterval && started) {
      console.log('bing', interval);
      const timeout = setTimeout(() => {
        console.log('done', paths?.value?.length);
        if (!paths?.done) {
          nextValue();
        }
      }, interval);
      setNextInterval(timeout);
    }
  }, [started, paths?.value?.length]);
  function reset() {
    resetGenerator();
    setStarted(false);
    clearInterval(nextInterval);
    setNextInterval(undefined);
  }
  function next() {
    setStarted(true);
    nextValue();
  }
  function finish() {
    let p = paths;
    let count = 0;
    while (!p.done) {
      p = nextValue();
      ++count;
    }
    console.log('took', count, 'steps');
  }
  const controls = (
    <Grid container>
      <Grid item xs={4}>
        <Button color="primary" onClick={() => !paths?.done && next()}>
          {paths?.done ? 'done' : 'step'}
        </Button>
        <Button color="primary" onClick={() => reset()}>
          reset
        </Button>
        <Button color="primary" onClick={() => finish()}>
          finish
        </Button>
      </Grid>
      <Grid item xs={4}>
        <label>
          tol.:{' '}
          <input
            min="-6"
            max="6"
            value={tolerance}
            disabled={started}
            type="number"
            onChange={(e) => setTolerance(parseInt(e.target.value))}
          />
        </label>
      </Grid>
      <Grid item xs={4}>
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
      {view === 'tree' && (
        <PathTree
          height={height}
          paths={paths?.value}
          getColor={(scale) => scaleColor(scale)}
          getValue={(a, b) => getDiff(a, b)}
        />
      )}
      {view === 'graph' && (
        <PathGraph
          paths={paths?.value}
          height={height}
          width={width}
          getColor={(scale) => scaleColor(scale)}
          getValue={(a, b) => getDiff(a, b)}
          includeStartNode={true}
          showCalculation={true}
          showDuplicates={true}
        />
      )}
    </>
  );
  const levelHeight = 80;
  const dynamicHeight = (max(paths?.value || [], (p: Path) => p.path.length + 1) || 1) * levelHeight;
  if (noScroll) {
    return (
      <>
        {controls}
        <Card elevation={3}>
          <CardContent style={{ width: '100%', overflow: 'auto', textAlign: 'center' }}>
            <Content height={dynamicHeight} />
          </CardContent>
        </Card>
        {dynamicHeight > 500 ? controls : <></>}
      </>
    );
  }
  const h = height ? Math.min(dynamicHeight + 40, height) : dynamicHeight;
  return (
    <>
      {controls}
      <Card elevation={3}>
        <CardContent style={{ height: h, textAlign: 'center', overflow: 'auto' }}>
          <Content height={Math.min(maxHeight, dynamicHeight)} />
        </CardContent>
      </Card>
      {dynamicHeight > 500 ? controls : <></>}
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
