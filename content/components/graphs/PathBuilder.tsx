import { Chord } from '@tonaljs/tonal';
import React, { useEffect, useMemo } from 'react';
import { useGenerator } from '../common/useGenerator';
import chordScales from '../sets/chordScales';
import chromaDifference from '../sets/chromaDifference';
import scaleChroma from '../sets/scaleChroma';
import scaleColor from '../sets/scaleColor';
import GraphvizJSON from './GraphvizJSON';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

function* buildTree(candidates, getValue, keepLongerPaths = false) {
  let paths = [];
  let source = { path: [], value: 0, values: [] };
  let isFinished = false;
  let minIndex = 0;
  while (!isFinished) {
    const level = source.path.length;
    const sourceCandidate = source.path.length > 0 ? source.path.slice(-1)[0] : undefined;
    const findShorterPath = (target, lvl, minValue) =>
      paths.find(({ path, values }) => path.length > lvl && path[lvl] === target && values[lvl] < minValue);
    const nextCandidates = candidates[level];
    const nextPaths = nextCandidates.reduce((next, target) => {
      const nextValue = getValue(sourceCandidate, target);
      const value = source.value + nextValue;
      const targetPath = [...source.path, target];
      const lvl = source.path.length;
      // check if already have shorter path to target => ignore
      const shorter = findShorterPath(target, lvl, value);
      if (!!shorter && !keepLongerPaths) {
        // console.log('already have a shorter path..');
        return next;
      }
      next.push({
        path: targetPath,
        value,
        values: source.values.concat([value]),
      });
      // the following is maybe not really needed with combinedDiff.. it's too expensive this way...
      paths = paths.map((p) => {
        const { path } = p;
        if (path.length === lvl + 1 && path[lvl] === sourceCandidate) {
          console.log('update similar path..'); // must be of equal value to be
          return {
            path: path.concat([target]),
            value: p.value + nextValue,
            values: p.values.concat([value]),
          };
        }
        return p;
      });
      return next;
    }, []);
    paths.splice(minIndex, 0, ...nextPaths); // to keep order
    //paths = paths.concat(nextPaths);
    let /* minIndex,  */ minValue, longest, longestIndex;
    paths.forEach((current, index) => {
      const { value, path } = current;
      if (longest === undefined || path.length > longest.path.length) {
        longest = current;
        longestIndex = index;
      }
      // only use non finished paths for next
      if (minValue === undefined || value < minValue) {
        minValue = value;
        minIndex = index;
      }
    });
    source = paths[minIndex];
    if (paths[minIndex].path.length === candidates.length) {
      //paths = [paths[minIndex]];
      isFinished = true;
    }
    if (!source) {
      isFinished = true;
    }
    if (!isFinished) {
      yield paths;
      paths.splice(minIndex, 1); // remove old path
    }
  }
  return paths;
}

export default ({ chords, scales, height, noScroll, getValue , keepLongerPaths}) => {
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
      return buildTree(candidates, getDiff, keepLongerPaths);
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
  /* let p = buildTree(candidates, scaleDiff);
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
    return (
      <div style={{ height: height + 30 }}>
        {controls}
        <PathTree paths={paths?.value} height={height || 800} getValue={getDiff} />
      </div>
    );
  }
  return (
    <div>
      {controls}
      {/* <div style={{ display: 'flex' }}> */}
      <Card elevation={3}>
        <CardContent style={{ height: height || 800, overflow: 'auto' }}>
          <PathTree paths={paths?.value} height={height || 800} getValue={getDiff} />
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

function PathTree({ paths, height, getValue }) {
  if (!paths) {
    return null;
  }
  let nodes: any[] = [{ label: 'start', id: '0' }];
  let edges = [];
  const nodeId = (i, j) => `${i}.${j}`;
  // TODO: color edges of smallest path
  paths.forEach(({ path, value }, i) => {
    path.forEach((label, j) => {
      const target = nodeId(label, j);
      const match = nodes.find(({ id }) => id === target);
      if (!match) {
        nodes.push({ label, id: target, level: j, fillcolor: scaleColor(label), style: 'filled' });
      }
      if (j === 0) {
        edges.push({ source: '0', target, label: '0' });
      } else {
        const source = nodeId(path[j - 1], j - 1);
        //const diff = chromaDifference(scaleChroma(path[j - 1]), scaleChroma(label));
        const diff = getValue(path[j - 1], label);
        const isDuplicate = edges.find(({ source: s, target: t }) => source === s && target === t);

        if (j === path.length - 1) {
          edges.push({
            source,
            target,
            label: `+${diff}=${value}`,
            //fillcolor: isDuplicate ? 'yellow' : 'green',
            //style: 'filled',
          });
        } else if (!isDuplicate) {
          edges.push({
            source,
            target,
            label: `+${diff}`,
            //fillcolor: isDuplicate ? 'yellow' : 'green',
            //style: 'filled',
          });
        }
      }
    });
  });

  return (
    <GraphvizJSON
      options={{ width: 600, height: height || 800 }}
      json={{
        graph: {
          directed: true,
          nodes,
          edges,
        },
      }}
    />
  );
}
