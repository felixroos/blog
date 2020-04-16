Moved from harmonical lib > still contains source code to generate stuff


# Markov Chain Chord Progressions

Idea: Use Markov Chains to generate chord sequences

[(If you forgot what markov chains are)](http://setosa.io/ev/markov-chains/)

## Markov States

Each possible chord is a state:

- There are ~60 chord symbols used in [ireal](https://github.com/felixroos/harmonical/blob/master/src/Harmony.ts#L12).
- Each chord can have 12 different roots (possibly more due to enharmonics)

So there are 60\*12 = 720 states.

- _TBD: Think about harmonic rhythm_
- _TBD: Think about pitch independent states_
- _TBD: Think about states that include enharmonics_

## Transition Probabilities

- Using the ireal 1350 standards set, we can calculate the probabilities between the states.
- I already created the 1350_stats set

### Data Structures

The changes set has the following structure:

```js
const changes = [
  {
    semitones: 5,
    symbols: ['-7', '7'],
    count: 7584,
    roots: {
      C: 1015,
      D: 1249
      /* ... all root counts */
    },
    chromas: {
      '0': 1015,
      '1': 78
      /* ... all chroma counts */
    }
  },
  {
    semitones: 5,
    symbols: ['7', '^7'],
    count: 3359,
    roots: {
      Ab: 154,
      E: 56
      /* ... all root counts */
    },
    chromas: {
      '0': 647,
      '1': 57
      /* ... all chroma counts */
    }
  }
  /* ... all other changes.. */
];
```

A chord state looks like that:

```js
const chord = {
  root: 'C'
  symbol: '-7',
};
```

### Calculating the Probabilities

```ts
function transitionProbabilities(chord) {
  /* First we can filter the changes that start with our chord symbol: */

  const relatedChanges = changes.filter(
    change => change.symbols[0] === chord.symbol
  );

  /* => if we had C-7 like above, we would get only the changes that start with a `-7`.
Now we can calculate the total number of possibilities for the next chord: */

  const possibilities = relatedChanges.reduce(
    (count, change) => count + change.total
  );

  /* This just adds all counts of the related changes together. */

  /* Now we have all ingredients to calculate probabilities for each follow up chord: */

  return relatedChanges.map(change => ({
    next: {
      root: transpose(chord.root, Interval.fromSemitones(change.semitones)),
      symbol: change.symbols[1]
    },
    probability: change.roots[chord.root] / possibilities
  }));
}
```

e.g. `transitionProbabilites({ root:'C', symbol:'-7' })` could output:

```js
[
  {
    next: {
      root: 'F',
      symbol: '7'
    },
    probability: 0.2 // not the actual number
  },
  {
    next: {
      root: 'F',
      symbol: '-7'
    },
    probability: 0.1 // not the actual number
  }
  /* etc... */
];
```

### Generate all possible States

We can generate all possible states like this:

```ts
function possibleStates(roots, symbols) {
  /** Fist, lets generate all possible states: */
  const states = possibleRoots.reduce(
    (allStates, root) =>
      allStates.concat(allSymbols.map(symbol => ({ root, symbol }))),
    []
  );
}
const possibleRoots = ['C', 'C#', 'Db' /** etc */];
const possibleSymbols = ['-7', '7', '^7' /** etc */];
possibleStates(possibleRoots, possibleSymbols);
// outputs [{ root: 'C', symbol: '-7' }, /* etc */ ]
```

### Generate Matrix

With the above function we can now generate a matrix that contains all transition probabilities:

```ts
function transitionMatrix(states) {
  return states.map(chord => transitionProbabilites(chord));
}
```

Which outputs a two dimensional Array with states.length\*states.length cells:

```ts
[
  [0.1, 0.01, 0.2 /* etc */],
  [0.01, 0.04, 0.12 /* etc */]
  /* etc */
];
```

- the first index of the array is the state we're in
- the second index is the state we transition to

### Lookup

To lookup the probability for a certain transition we can now do:

```js
const roots = ['C', 'C#', 'Db' /** etc */];
const symbols = ['-7', '7', '^7' /** etc */];
const states = possibleStates(roots, symbols);
const matrix = transitionMatrix(states);

function transitionProbability(from, to, states) {
  return matrix[states.indexOf(from)][states.indexOf(to)];
}
// example usage:
transitionProbability(
  { root: 'C', symbol: '-7' },
  { root: 'F', symbol: '7' },
  states
);
// outputs float e.g. 0.06
```

### Initial State Probabilites

TBD: Analyze Standards for starting chords

## Playing with Sequences

### Probability of an existing Sequence

With the matrix, we can calculate the commonness of a tune by just multiplying all transition probabilites together.

### Generating Sequences

Using a weighted randomizer, we can generate chord sequences that follow the markov model:

```
TBD
```

### Rootless Probabilities

Instead of using each possible chord as states, we could just probabilities to the changes set. This will ignore the fact that some roots are more often used than others with the same change.

```js
const changesWithProbabilities = [
  {
    semitones: 5,
    symbols: ['-7', '7'],
    count: 7584,
    // probability: getProbabilty(change, changes),
    groupSize: getGroupSize(change, changes),
    roots: {
      C: 1015,
      D: 1249
      /* ... all root counts */
    },
    chromas: {
      '0': 1015,
      '1': 78
      /* ... all chroma counts */
    }
  }
  /* .. */
];

function getGroupSize(change, changes) {
  return changes
    .filter(c => c.symbols[0] === change.symbols[0])
    .reduce((sum, c) => sum + c.count, 0);
}

function getProbability(change, changes) {
  return change.count / getGroupSize(change, changes);
}
```

Now we can get the next possible chords like this:

```js
// changes now have probabilities precalculated like done above
function nextPossibleChords(from, to, changes) {
  const semitones = Interval.semitones(Distance.interval(from.root, to.root));
  const possibleChanges = changes.filter(c => c.semitones === semitones);
  return possibleChanges.map(change => ({
    chord: change.root + change.symbol,
    // probability: getProbability(change, changes),
    // could also be precalculated:
    // probability: change.count / getGroupSize(change, changes)
    probability: change.count / change.groupSize
  })); // could also be sorted by probability
}
```

## Hidden Markov Model Melodies

We could step up the whole thing by adding melodies/notes into the mix. This could be achieved by a hidden markov model:

- We do not know the changes
- We can just observe notes that are played
- We can guess the changes

### Note choice probabilities

For that, we would need probabilities for a pitch to appear over a certain chord symbol:

```js
[
  {
    pitch: 'C',
    state: {
      root: 'A',
      symbol: '-7'
    },
    probability: 0.6
  },
  {
    pitch: 'C#',
    state: {
      root: 'A',
      symbol: '-7'
    },
    probability: 0.00000001
  }
  /** etc.. */
];
```

The above example shows that a C is much more likely to appear over a A-7 than a C#.

We could also have different probability sets for melodies vs chord voicings.

Having that, we can guess the changes, or, the other way around: generate melodies or voicings based on chord symbols!

### How to obtain note choice probabilities?

We would need a set of transcriptions that include chord symbols, or at least tunes where the changes are known.
