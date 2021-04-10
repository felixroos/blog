import scaleModes from '../sets/scaleModes';
import chordScales from '../sets/chordScales';
import { Chord } from '@tonaljs/tonal';
import bySetNum from '../sets/bySetNum';
import scaleColor from '../sets/scaleColor';
import chromaDifference from '../sets/chromaDifference';
import scaleChroma from '../sets/scaleChroma';
import { ENGINE_METHOD_DIGESTS } from 'constants';

export default function chordScaleTree(chords, allowedScales = scaleModes('major'), halfDifference = false) {
  const scales = chords
    .map((chord) => chordScales(chord, allowedScales, true))
    .map((choices) => (choices.length > 0 ? choices : ['chromatic']));
  console.log('scales', scales);
  let nodes = [];
  let links = [];
  scales.forEach((choices, i) => {

  });
  nodes = nodes.map((node, id) => ({ ...node, id }));
  return { nodes, edges: links };
};

export function buildTreeLevel(targets, source = null) {
  const edges = [];
  const nodes = [];
  const getId = (id) => source ? `${source}.${id}` : id + '';
  targets.forEach((target, i) => {
    const id = getId(i);
    nodes.push({ label: target, id });
    edges.push({ source, target: id })
  });
  return { nodes, edges };
}

export function buildTree(levels, nodes = [], edges = []) {
  if (levels.lenth === 0) {
    return { nodes, edges }
  }
  levels[0].forEach(node => {
    const next = buildTreeLevel(levels[1], node);
  })

  levels.forEach(level => {
    const next = buildTreeLevel(level);
    nodes = nodes.concat(next.nodes);
    edges = edges.concat(next.edges);
  });
  return { nodes, edges }
}

/*
[
      [ 'D phrygian', 'D aeolian', 'D dorian' ],
      [ 'G mixolydian', 'G altered' ],
      [ 'C lydian', 'C major' ]
]

D phrygian -> G mixolydian -> C lydian
                           -> C major
           -> G altered    -> C lydian
                           -> C major

*/

