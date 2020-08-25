import { Path } from './hierarchy';

export function pathTimeDuration(path: Path[], whole = 1) {
  let time = 0;
  let duration = whole;
  for (let i = 0; i < path.length; i++) {
    time = time + path[i][0] / path[i][2] * duration
    duration *= path[i][1] / path[i][2];
  }
  return { time, duration };
}