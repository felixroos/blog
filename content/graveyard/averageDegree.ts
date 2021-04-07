import { harmonicDegree } from '../components/common/harmonicDegree';

export function averageDegree(pitches, rotate, flip) {
  return pitches.map(pitch => harmonicDegree(pitch, rotate, flip))
    .reduce((sum, degree) => sum + degree, 0) / pitches.length;
}