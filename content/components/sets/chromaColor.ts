import { interpolateSinebow } from 'd3-scale-chromatic';
import chromaAverage from './chromaAverage';

export default function chromaColor(chroma) {
  return interpolateSinebow(chromaAverage(chroma) / 12);
}