import chromaDifference from '../sets/chromaDifference';
import scaleChroma from '../sets/scaleChroma';

declare interface ScalePath {
  value: number;
  path: string[];
}

export default function scalePath(scales, paths: ScalePath[] = []) {

  //scalePath(scales, paths.concat(scales[0].map(scale => ({ path: [scale], value: 0 }))));

  const min = paths.reduce((min, path, index): number => min === -1 || paths[min].value > path.value ? index : min, -1);
  if (paths[min].path.length === scales.length) {
    return paths[min].path;
  }
  const diff = chromaDifference(scaleChroma(paths[min].path[0]), scaleChroma(scales[paths[min].path.length]));
}
