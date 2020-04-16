<!-- ## Goal

The goal is to generate permutations of any items by following certain rules. For example we could want all possible voicings of a c major chord, with a minimum of two notes and a maximum of four notes:

```ts
voicings(["C", "E", "G"], {
  minNotes: 2,
  minNotes: 4,
  minDistance: 1, // semitones
  maxDistance: 7, //semitones
  required: ["E"],
})
```

All possible voicings, by following the above rules, would be:

```js
;[
  ["C", "E"],
  ["E", "G"],
  ["C", "E", "G"],
  ["E", "G", "C"],
  ["G", "C", "E"],
  ["C", "E", "G", "C"],
  ["C", "G", "C", "E"],
  ["E", "G", "C", "G"],
  ["E", "G", "C", "E"],
  ["G", "C", "E", "G"],
]
```

So voicings are basically permutations of chord notes within given constraints.
But before we get into the voicing implementation, we need to understand the algorithm behind it. -->

## Modeling Musical Voicings

We can now try to model the permutation of musical voicings to the ones we developed with the urn model.

### Using pitch classes

If we use notes without octaves (pitch classes):

- Order is important
- Each pitch can be picked multiple times
- we pick a subset of the chord notes, but at least all notes that define the chord

Problem:

- we cannot generate voicings with intervals higher than an octave between notes
- we cannot take range specific considerations into the search tree (e.g. low interval limits)

### Using notes with octave numbers

- Order is not important
- Each note can only be picked once
- we pick a subset of the chord notes, but at least all notes that define the chord

### Required vs optional pitches

If we want to properly voice a chord symbol, there are

- some pitches that have to be played aka required pitches
- some pitches that can be omitted without changing the chord quality

For example, a C7 chord:

- required pitches: E and Bb
- optional pitches: C and G
- one could argue that is C is also required. That depends on what we want to achieve
