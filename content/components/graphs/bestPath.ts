export default function* bestPath(candidates, getValue, options = {}) {
  const { keepLongerPaths, tolerance } = { tolerance: 0, keepLongerPaths: false, ...options };
  let paths = [];
  let source = { path: [], value: 0, values: [], acc: [] };
  let isFinished = false;
  let minIndex = 0;
  while (!isFinished) {
    const level = source.path.length;
    const sourceCandidate = source.path.length > 0 ? source.path.slice(-1)[0] : undefined;
    const findBetterPath = (target, lvl, minValue) =>
      paths.find(({ path, acc }) => path.length > lvl && path[lvl] === target && acc[lvl] < minValue - tolerance);
    const nextCandidates = candidates[level];
    const nextPaths = nextCandidates.reduce((next, target) => {
      const nextValue = getValue(sourceCandidate, target, source);
      const values = source.values.concat([nextValue]);
      const value = source.value + nextValue;
      const acc = source.acc.concat([value]);
      const targetPath = [...source.path, target];
      const lvl = source.path.length;
      // check if already have shorter path to target => ignore
      const shorter = findBetterPath(target, lvl, value);
      if (!!shorter && !keepLongerPaths) {
        // console.log('found better path..', shorter, target, value, values, lvl);
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
          // console.log('update similar path..'); // must be of equal value to be
          return {
            path: path.concat([target]),
            value: p.value + nextValue,
            values: p.values.concat([nextValue]),
            acc: p.values.concat([value]),
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
      //const stepsLeft = candidates.length - path.length;
      // only use non finished paths for next
      const worst = false;
      if (minValue === undefined || (!worst && value < minValue) || (worst && value > minValue)) {
        minValue = value;
        minIndex = index;
      }
    });
    source = paths[minIndex];
    if (paths[minIndex].path.length === candidates.length) {
      //paths = [paths[minIndex]];
      //paths = paths.filter(({ path }) => path.length === candidates.length);
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