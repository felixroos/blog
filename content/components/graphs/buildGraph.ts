export default function* buildGraph(candidates, getValue, keepLongerPaths = false) {
  let paths = [];
  let source = { path: [], value: 0, values: [], acc: [] };
  let isFinished = false;
  let minIndex = 0;
  while (!isFinished) {
    const level = source.path.length;
    const sourceCandidate = source.path.length > 0 ? source.path.slice(-1)[0] : undefined;
    const findShorterPath = (target, lvl, minValue) =>
      paths.find(({ path, acc }) => path.length > lvl && path[lvl] === target && acc[lvl] < minValue);
    const nextCandidates = candidates[level];
    const nextPaths = nextCandidates.reduce((next, target) => {
      const nextValue = getValue(sourceCandidate, target);
      const values = source.values.concat([nextValue]);
      const value = source.value + nextValue;
      const acc = source.acc.concat([value]);
      const targetPath = [...source.path, target];
      const lvl = source.path.length;
      // check if already have shorter path to target => ignore
      const shorter = findShorterPath(target, lvl, value);
      if (!!shorter && !keepLongerPaths) {
        // console.log('found shorter path..', shorter, target, value, values, lvl);
        return next;
      }
      next.push({
        path: targetPath,
        value,
        values,
        acc
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