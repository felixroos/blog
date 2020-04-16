assorted notes about polyphony

## polyphony with relative timing

having relative timing assumes one event happening after the other.
in music, we often want polyphony.

true polyphony means multiple notes can play at the the same time, while their attack and release times can also be different from each other.

### polyphony examples

lets define a pseudo midi view:

- "-" = sustain
- " " = silence
- each line is one "voice"

example A: chord with three notes

```
----------
----------
----------
```

- same attack / release time
- => homophony

example B: chord arpeggio:

```
----------
  --------
    ------
```

- different attack times, same release times

example C:

```
------
--------
----------
```

- same attack, different release

example D:

```
----------
  ------
    --
```

- different attack, different release

example E:

```
------
  ------
    ------
```

example F:

```
----
   ----
      ----
```

- different attack, different release, without first overlapping third

### solution A:

use poly wrapper:

```js
;[
  // example A
  [
    4,
    "poly",
    [4, "note", "C"], //
    [4, "note", "Eb"], //
    [4, "note", "G"], //
  ],
  // example C
  [
    4,
    "poly",
    [4, "note", "C"], //
    [3, "note", "Eb"], //
    [2, "note", "G"], //
  ],
]
```

problem: attacks can only be at the same time
=> single note starts cannot be independent e.g. sustained arpeggios

possible solution:

```js
;[
  // example B
  [
    4,
    "poly",
    [4, "note", "C"], //
    [[3, 1], "note", "Eb"], //
    [[2, 2], "note", "G"], //
  ],
  // example D
  [
    5,
    "poly", //
    [5, "note", "C"], //
    [[3, 1], "note", "Eb"], // delayed 1
    [[1, 2], "note", "G"], // delayed 2
  ],
  // example E
  [
    6,
    "poly",
    [4, "note", "C"], //
    [[4, 1], "note", "Eb"], //
    [[4, 2], "note", "G"], //
  ],
  // example F
  [
    12,
    "poly",
    [4, "note", "C"], //
    [[4, 3], "note", "Eb"], //
    [[4, 8], "note", "G"], //
  ],
]
```

this approach uses an array that contains [duration, offset].

poly basically takes us into absolute time land, starting at a certain relative position.

### solution B

lets try a synthesizer style approach:

```js
;[
  // example A
  [0, "attack", "C"], // first note
  [0, "attack", "Eb"], // .. second
  [0, "attack", "G"], // .. third
  [4, "release-all"],
  // example B
  [1, "attack", "C"], // first note
  [1, "attack", "Eb"], // .. second
  [2, "attack", "G"], // .. third
  [0, "release-all"],
  // example C
  [0, "attack", "C"], // first note
  [0, "attack", "Eb"], // .. second
  [0, "attack", "G"], // .. third
  [2, "release", "C"],
  [1, "release", "Eb"],
  [1, "release", "G"],
  // example D
  [1, "attack", "C"], // first note
  [1, "attack", "Eb"], // .. second
  [1, "attack", "G"], // .. third
  [1, "release", "G"], // .. third
  [1, "release", "Eb"],
  [0, "release", "C"],
  // example E
  [1, "attack", "C"],
  [1, "attack", "Eb"],
  [1, "attack", "G"],
  [1, "release", "C"],
  [1, "release", "Eb"],
  [1, "release", "G"],
  // example F
  [3, "attack", "C"],
  [1, "attack", "Eb"],
  [2, "release", "C"],
  [1, "attack", "G"],
  [3, "release", "Eb"],
  [0, "release", "G"],
]
```

this works but also feels wrong:

- readability suffers
- information for single notes are at multiple places

### solution C

- can optionally specify length inside time array
- time = [duration, length]
  - duration = how much time passes until the note is released
  - length = how much time passes until the next event starts
  - if time is a number => length = duration = time

```js
;[
  // example A
  [[4, 0], "note", "C"],
  [[4, 0], "note", "Eb"],
  [4, "note", "G"],
  // example B
  [[4, 1], "note", "C"],
  [[3, 1], "note", "Eb"],
  [2, "note", "G"],
  // example C
  [[2, 0], "note", "C"],
  [[3, 0], "note", "Eb"],
  [4, "note", "G"],
  // example D
  [[5, 1], "note", "C"],
  [[3, 1], "note", "Eb"],
  [1, "note", "Eb"],
  [2, "rest"],
  // example E
  [[4, 1], "note", "C"],
  [[4, 1], "note", "Eb"],
  [4, "note", "G"],
]
```

### solution D

lets use [duration, offset] as time attributes:

```js
;[
  // example A
  [4, "note", "C"],
  [[4, -4], "note", "Eb"],
  [[4, -4], "note", "G"],
  // example B
  [4, "note", "C"],
  [[3, -3], "note", "Eb"],
  [[2, -2], "note", "G"],
  // example C
  [2, "note", "C"],
  [[3, -2], "note", "Eb"],
  [[4, -3], "note", "G"],
  // example D
  [5, "note", "C"],
  [[3, -4], "note", "Eb"],
  [[1, -3], "note", "Eb"],
  // example E
  [4, "note", "C"],
  [[4, -3], "note", "Eb"],
  [[4, -3], "note", "G"],
]
```

## Evaluation

Common polyphony actions:

1. add note to single note
2. add note to multiple notes
3. remove note from more than two notes
4. remove note from two notes

### A

```js
// initial
[4, 'note', 'C'],
// 1. add note to single note
[4, 'poly', // +
[4, 'note', 'C']
[4, 'note', 'G'] // +
], // +
//2. add note to multiple notes
[4, 'poly',
[4, 'note', 'C']
[4, 'note', 'Eb'] // +
[4, 'note', 'G'],
//3.
[4, 'poly',
[4, 'note', 'C']
// [4, 'note', 'Eb'] // -
[4, 'note', 'G'],
//3.
// [4, 'poly',
[4, 'note', 'C'], // -
// [4, 'note', 'G'],
]
```

### B

1. add note to single note
2. add note to multiple notes
3. remove note from more than two notes
4. remove note from two notes

```js
// first note
[4, 'note', 'C'],
// 1. add note to single note
[0, 'attack', 'C'], // -4 +0 -note +attack
[0, 'attack', 'G'], // +
[4, 'release-all'], // +
// 2. add note to multiple notes
[0, 'attack', 'C'],
[0, 'attack', 'Eb'], // +
[0, 'attack', 'G'],
[4, 'release-all'],
// 3. remove note from more than two notes
[0, 'attack', 'C'],
// [0, 'attack', 'Eb'], // -
[0, 'attack', 'G'],
[4, 'release-all'],
// 4. remove note from two notes
[4, 'note', 'C'], // -0 +4 -attack+note
// [0, 'attack', 'G'], // -
// [4, 'release-all'], // -
```

### C

```js
;[[4, "note", "C"]]
```

## Object Notation

Since Solution A seems the best. Lets examine how object notation could optimize it.

This was Solution A in Array notation:

```js
;[
  // example B
  [
    4,
    "poly",
    [4, "note", "C"], //
    [[3, 1], "note", "Eb"], //
    [[2, 2], "note", "G"], //
  ],
  // example D
  [
    5,
    "poly", //
    [5, "note", "C"], //
    [[3, 1], "note", "Eb"], // delayed 1
    [[1, 2], "note", "G"], // delayed 2
  ],
  // example E
  [
    6,
    "poly",
    [4, "note", "C"], //
    [[4, 1], "note", "Eb"], //
    [[4, 2], "note", "G"], //
  ],
  // example F
  [
    12,
    "poly",
    [4, "note", "C"], //
    [[4, 3], "note", "Eb"], //
    [[4, 8], "note", "G"], //
  ],
]
```

In object notation, it looks like that:

```js
;[
  // example A
  {
    d: 4,
    poly: [
      { d: 4, note: "C" }, //
      { d: 4, note: "Eb" }, //
      { d: 4, note: "G" }, //
    ],
  },
  // example B
  {
    t: 4,
    poly: [
      { t: 4, note: "C" }, //
      { t: [3, 1], note: "Eb" }, //
      { t: [2, 2], note: "G" }, //
    ],
  },
  // example C
  {
    t: 4,
    poly: [
      { t: 4, note: "C" }, //
      { t: 3, note: "Eb" }, //
      { t: 2, note: "G" }, //
    ],
  },
  // example D
  {
    t: 5,
    poly: [
      { t: 5, note: "C" }, //
      { t: [3, 1], note: "Eb" }, // delayed 1
      { t: [1, 2], note: "G" }, // delayed 2
    ],
  },
  // example E
  {
    t: 6,
    poly: [
      { t: 4, note: "C" }, //
      { t: [4, 1], note: "Eb" }, //
      { t: [4, 2], note: "G" }, //
    ],
  },
  // example F
  {
    t: 12,
    poly: [
      { t: 4, note: "C" }, //
      { t: [4, 3], note: "Eb" }, //
      { t: [4, 8], note: "G" }, //
    ],
  },
]
```

possible optimizations:

- duration can be omitted if it is the same as poly duration
- an object with only a note value can be a string/number
- d can remain number, offset can be used with already known t attribute (= absolute time, defaults to 0)
- poly attr can be renamed to p
- note attr can be renamed to more flexible value => could contain chords or rests or whatever

```js
;[
  // example A
  {
    d: 4,
    p: ["C", "Eb", "G"], // most common usage
  },
  // example B
  {
    d: 4,
    p: [
      { d: 4, t: 0, value: "C" }, // t could be left out here (0 = default)
      { d: 3, t: 1, value: "Eb" }, //
      { d: 2, t: 2, value: "G" }, //
    ],
  },
  // example C
  {
    d: 4,
    p: [
      "C",
      // { d: 4, value: 'C' }, // same
      { d: 3, value: "Eb" }, //
      { d: 2, value: "G" }, //
    ],
  },
  // example D
  {
    d: 5,
    p: [
      { d: 5, value: "C" }, //
      { d: 3, t: 1, value: "Eb" }, // delayed 1
      { d: 1, t: 2, value: "G" }, // delayed 2
    ],
  },
  // example E
  {
    d: 6,
    p: [
      { d: 4, value: "C" }, //
      { d: 4, t: 1, value: "Eb" }, //
      { d: 4, t: 2, value: "G" }, //
    ],
  },
  // example F
  {
    d: 12,
    p: [
      { d: 4, value: "C" }, //
      { d: 4, t: 3, value: "Eb" }, //
      { d: 4, t: 8, value: "G" }, //
    ],
  },
]
```

## idea 4: repeating n times

music often repeats, we could add the attribute n to render one part multiple times.

Design decision: there are two ways we could interpret the n attribute:

1. as a scaling factor of duration

```json
[
  "A",
  "A", // each a will have d = 1
  { "m": "A", "n": 2 }, // same (if n scales d)
  { "m": ["A", "A"] }, // each a will have d = 0.5
  { "m": "A", "n": 2, "d": 0.5 } // same (if n scales d)
]
```

2. not as a scaling factor of duration

```json
[
  "A",
  "A", // each a will have d = 1
  { "m": "A", "n": 2, "d": 2 }, // same (if n doesnt scale d)
  { "m": ["A", "A"] }, // each a will have d = 0.5
  { "m": "A", "n": 2 } // same (if n doesnt scale d)
]
```

I would naturally tend to the first option.

## typescript interface proposition

with all the previous ideas, we can now formulate a single typscript interface for the whole concept:

```ts
interface Music<T> = T | {
  name?: string;
  t: number = 0, // time
  d: number = 1, // duration
  v: number = 1, // volume
  n: number = 1, // repetitions =>
  p?: Music<T>[] || Music<T>, // polyphony
  m?: Music<T>[] || Music<T>, // monophony
}
```

#### Simple Example: Alle Meine Entchen

for the most common applications, like melodies, this gets really simple:

```js
{
name: 'Alle meine Entchen',
type: 'relative',
m: [
  'C',
  'D',
  'E',
  'F',
  { m: 'G', d: 2 },
  { m: 'G', d: 2 },
  { m: 'A', n: 4 },
  { m: 'G', d: 4 },
  { m: 'A', n: 4 },
  { m: 'G', d: 4 },
  { m: 'F', n: 4 },
  { m: 'E', d: 2 },
  { m: 'E', d: 2 },
  { m: 'D', n: 4 },
  { m: 'C', d: 4 }
]
}
```

convert relative to absolute + resolve n attributes:

```ts
function relative2absolute(music: Music[]) {
  let t = 0
  return music
    .map(event => (event.typeof === "string" ? { m: event.split(" ") } : event))
    .reduce((absolute, event) => {
      absolute = absolute.concat(
        new Array(event.n ?? 1).fill({
          ...event,
          t,
        })
      )
      t += (event.d ?? 1) * (event.n ?? 1)
      return absolute
    }, [])
}
```

yields absolute times/durations:

```js
;[
  { m: "C", d: 1, t: 0 },
  { m: "D", d: 1, t: 1 },
  { m: "E", d: 1, t: 2 },
  { m: "F", d: 1, t: 3 },
  { m: "G", d: 2, t: 4 },
  { m: "G", d: 2, t: 6 },
  { m: "A", d: 1, t: 8 },
  { m: "A", d: 1, t: 9 },
  { m: "A", d: 1, t: 10 },
  { m: "A", d: 1, t: 11 },
  { m: "G", d: 4, t: 12 },
  { m: "A", d: 1, t: 16 },
  { m: "A", d: 1, t: 17 },
  { m: "A", d: 1, t: 18 },
  { m: "A", d: 1, t: 19 },
  { m: "G", d: 4, t: 20 },
  { m: "F", d: 1, t: 24 },
  { m: "F", d: 1, t: 25 },
  { m: "F", d: 1, t: 26 },
  { m: "F", d: 1, t: 27 },
  { m: "E", d: 2, t: 28 },
  { m: "E", d: 2, t: 30 },
  { m: "D", d: 1, t: 32 },
  { m: "D", d: 1, t: 33 },
  { m: "D", d: 1, t: 34 },
  { m: "D", d: 1, t: 35 },
  { m: "C", d: 4, t: 36 },
]
```

with compact rhythmical notation:

```js
{
name: 'Alle meine Entchen',
m: [
  ['C','D','E','F'],
  { m: 'G', n: 2 },
  { m: [{ m: 'A', n: 4 }, 'G'], n: 2 },
  { m: 'F', n: 4 },
  { m: 'E', n: 2 },
  { m: 'D', n: 4 },
  'C'
]
}
```

with simple rhythmical notation:

```js
{
name: 'Alle meine Entchen',
m: [
  ['C','D','E','F'],
  ['G','G'],
  ['A','A','A','A'],
  ['G'],
  ['A','A','A','A'],
  ['G'],
  ['F','F','F','F'],
  ['E','E'],
  ['D','D','D','D'],
  ['C'],
]
}
```

optimization: could also write multiple note strings as one string with spaces:

```js
{
name: 'Alle meine Entchen',
m: [
  'C D E F', 'G G',
  'A A A A', 'G', 'A A A A', 'G',
  'F F F F', 'E E',
  'D D D D', 'C',
]
}
```

=> each string is one measure

optimization: use \* string operator like tidal does:

```js
{
name: 'Alle meine Entchen',
m: [
  'C D E F', '2*G', '4*A', 'G', '4*A', 'G', '4*F', '2*E', '4*D', 'C',
]
}
```

=> this is as compact as it gets

#### Syncopation Example: Dolphin Dance

```js
{
name: 'Dolphin Dance',
m: [
  m: [
    [
      'r',
      { m: ['E','F','G', {m: 'D', d: 7}] }
    ],
    [],
  ], n: 2
]
}
```

alternative: extend length of syncopations afterwards via + sign:

```js
{
name: 'Dolphin Dance',
m: [
  m: [
    ['r', 'E F G D'],
    ['+3','r'],
  ], n: 2
]
}
```

=> very readable
=> could be a bit tricky to implement

#### Complex Polyphony Example: Cantaloupe Island

```js
{
name: 'Cantaloupe Island',
m: [
  {
    p: [
      { name: 'Right Hand'
        m: [ // quarter notes
          [ // eights notes
            'r',
            {
              p: ['Ab','C','F']
            }
          ],
          {
            p: ['Bb','D','F']
          },
          {
            p: ['C','Eb','F']
          },
          [
            {
            p: ['Bb','D','F'],
            },
            {
              p: ['Ab','C','F']
            }
          ]
        ]
      },
      {
        name: 'Left Hand',
        m: [
          ['F + + C'],
          ['+', ['Eb F']]
        ]
      }
    ]
  }
]
}
```

Optimization:

- seperate notes with commas to create polyphony
- add second change + repeat measures

```js
{
name: 'Cantaloupe Island',
m: [
  {
    n: 4,
    p: [ // F-
      [
        'r Ab,C,F',
        'Bb,D,F',
        'C,Eb,F'
        'Bb,D,F Ab,C,F'
      ],
      [
        'F + + C',
        ['+', ['Eb F']]
      ]
    ]
  },
  {
    n: 4,
    p: [ // Db7
      [
        'r Ab,Cb,F',
        'Bb*Db,F',
        'B,Eb,F'
        'Bb,Db,F Ab,Cb,F'
      ],
      [
        'Db + + F',
        ['+', ['G Bb']]
      ]
    ]
  }
]
}
```

This looks really promising, as it is really simple and readable. We could further explore the string world by using brackets inside strings + using dot seperators:

```
4*[
  [
    r Ab,C,F .
    Bb,D,F .
    C,Eb,F .
    Bb,D,F Ab,C,F
  ],[
    F + + C .
    + [Eb F]
  ]
]
4*[
  [
    r Ab,Cb,F .
    Bb,Db,F .
    B,Eb,F .
    Bb,Db,F Ab,Cb,F
  ],[
    Db + + F .
    + [G Bb]
  ]
]
```

Now we managed two cramp 8 bars of piano comping into just 22 lines of "code".

```js
;[
  // example A
  {
    t: 4,
    p: ["C", "Eb", "G"], // most common usage
  },
  // example B
  {
    d: 4,
    p: [
      { d: 4, note: "C" }, //
      // { d: 4, t:0, note: 'C' }, //
      { d: 3, t: 1, note: "Eb" }, //
      { d: 2, t: 2, note: "G" }, //
    ],
  },
  // example C
  {
    d: 4,
    p: [
      "C",
      // { d: 4, note: 'C' }, // same
      { d: 3, note: "Eb" }, //
      { d: 2, note: "G" }, //
    ],
  },
  // example D
  {
    d: 5,
    p: [
      { d: 5, note: "C" }, //
      { d: 3, t: 1, note: "Eb" }, // delayed 1
      { d: 1, t: 2, note: "G" }, // delayed 2
    ],
  },
  // example E
  {
    d: 6,
    p: [
      { d: 4, note: "C" }, //
      { d: 4, t: 1, note: "Eb" }, //
      { d: 4, t: 2, note: "G" }, //
    ],
  },
  // example F
  {
    d: 12,
    p: [
      { d: 4, note: "C" }, //
      { d: 4, t: 3, note: "Eb" }, //
      { d: 4, t: 8, note: "G" }, //
    ],
  },
]
```

## human readability vs computer ease of parsing

combined with rhythmical-style notation:

```js
{
    "name": "Dolphin Dance",
    "events": [
      [0, "nested",
        [ // measure 1
          ["rest"],
          [ // no beat number
            ["note", 76, 0.8], // no duration
            ["note", 77, 0.6],
            ["note", 79, 1],
            ["note", 74, 1, 7],
          ]
        ],
        [ // measure 2
          ["hold"],
          [
            ["hold"],
            ["rest"]
          ]
        ],
        [ // measure 3
          ["rest"],
          [
            ["note", 76, 1],
            ["note", 77, 0.6],
            ["note", 79, 1],
            ["note", 74, 1, 7],
          ]
        ]
        [10,  "note", 76, 1, 0.5],
        [4, "chord", "G", "-", 4]
      ]
    ],
    "interpretation": {
        "time_signature": "4/4",
        "key": "C",
        "transpose": 0
    }
}
```

Hey there, maybe I am a little late to the party, but being currently obsessed with this topic, I want to share my thoughts with you.

I already implemented a similar, yet more abstract format for the purpose of music playback / alorithmic composing etc..
Though I have only looked over the very beginning of the Lisp Paper, the idea of parallel vs sequential execution as fundamental building blocks is very similar to the syntax i came up with. Another concept that I added was the nested syntax like [TidalCycles](https://tidalcycles.org/) uses (also Tone.js Sequence).

In that format, this is the famous Groove of Cantaloupe Island by Herbie Hancock:

```js
{ // bassline = monophone / melody
  "m": ["F2", ["F2", "C3"], "C3", ["Eb3", "F3"]],
  // chords = polyphone / parallel
  "p": [
    { "m": [
        ['r', {  "p": ["Ab3", "C4", "F4"]}],
        { "p": ["Bb3", "D4", "F4"] },
        { "p": ["C4", "Eb4", "F4"] },
        [{ "p": ["Bb3", "D4", "F4"] },
         { "p": ["Ab3", "C4", "F4"] }]
    ]}
  ]
}
```

The main design goal here, was to provide only ONE element type that can be nested into itself. I'll let the code speak:

```ts
export type Music<T> = T | T[] | MusicObject<T>
export type MusicObject<T> = {
  t?: number // time
  d?: number // duration
  n?: number // play n times
  p?: Music<T>[] | Music<T> // polyphony / parallel
  m?: Music<T>[] | Music<T> // monophony / melody
}
```

In the example, the pitches use helmholtz pitch notation but it could be anything instead of strings (type T).
The second main design goal was to be able to provide the rhythmic structure purely by using array nesting (TidalCycles Style).
You can read more about that in my (work in progress) repo called [rhythmical](https://github.com/felixroos/rhythmical).
Having only one type of element that is self referential solves many issues:

Simple Melodies are really really short to notate, just use an array, which is totally valid:

```js
;[
  ["C", "D", "E", "F"],
  ["G", "G"],
  ["A", "A", "A", "A"],
  ["G"],
  ["A", "A", "A", "A"],
  ["G"],
  ["F", "F", "F", "F"],
  ["E", "E"],
  ["D", "D", "D", "D"],
  ["C"],
]
```

This is the german childrens song [Alle meine Entchen](http://www.franzdorfer.com/images/stories/Noten/alle%20meine%20entchen-1.png). The nesting provides all rhythmic information that is needed.

You can still decide to use a more midi like approach with the same format:

```js
{
  p: [
    { t: 0, m: "C", d: 0.5 },
    { t: 0.5, m: "D", d: 0.5 },
    { t: 1, m: "E", d: 0.5 },
    { t: 1.5, m: "F", d: 0.5 },
    { t: 2, m: "G", d: 1 },
    { t: 3, m: "G", d: 1 },
    { t: 4, m: "A", d: 0.5 },
    { t: 4.5, m: "A", d: 0.5 },
    { t: 5, m: "A", d: 0.5 },
    { t: 5.5, m: "A", d: 0.5 },
    { t: 6, m: "G", d: 2 },
    { t: 8, m: "A", d: 0.5 },
    { t: 8.5, m: "A", d: 0.5 },
    { t: 9, m: "A", d: 0.5 },
    { t: 9.5, m: "A", d: 0.5 },
    { t: 10, m: "G", d: 2 },
    { t: 12, m: "F", d: 0.5 },
    { t: 12.5, m: "F", d: 0.5 },
    { t: 13, m: "F", d: 0.5 },
    { t: 13.5, m: "F", d: 0.5 },
    { t: 14, m: "E", d: 1 },
    { t: 15, m: "E", d: 1 },
    { t: 16, m: "D", d: 0.5 },
    { t: 16.5, m: "D", d: 0.5 },
    { t: 17, m: "D", d: 0.5 },
    { t: 17.5, m: "D", d: 0.5 },
    { t: 18, m: "C", d: 2 },
  ]
}
```

But why would you want to be so verbose to convey the same information?
You could even easily translate that to musicJSON:

```js
;[
  [0, "note", "C", 0.5],
  [0.5, "note", "D", 0.5],
  [1, "note", "E", 0.5],
  [1.5, "note", "F", 0.5],
  [2, "note", "G", 1],
  [3, "note", "G", 1],
  [4, "note", "A", 0.5],
  [4.5, "note", "A", 0.5],
  [5, "note", "A", 0.5],
  [5.5, "note", "A", 0.5],
  [6, "note", "G", 2],
  [8, "note", "A", 0.5],
  [8.5, "note", "A", 0.5],
  [9, "note", "A", 0.5],
  [9.5, "note", "A", 0.5],
  [10, "note", "G", 2],
  [12, "note", "F", 0.5],
  [12.5, "note", "F", 0.5],
  [13, "note", "F", 0.5],
  [13.5, "note", "F", 0.5],
  [14, "note", "E", 1],
  [15, "note", "E", 1],
  [16, "note", "D", 0.5],
  [16.5, "note", "D", 0.5],
  [17, "note", "D", 0.5],
  [17.5, "note", "D", 0.5],
  [18, "note", "C", 2],
].map(([t, _, m, d]) => ({ t, m, d }))
```

I chose to use Objects instead of Arrays to be able to use TidalCycles notation and to be free from the fixed structure of the array, which easily breaks compatibilities + is not suitable for default values.

But this seems pretty verbose by comparison. Relative notation is enfored by making it default.
If you would still want to not use the nested notation, the same melody could be notated like this:

```js
;[
  { m: "C", d: 0.5 },
  { m: "D", d: 0.5 },
  { m: "E", d: 0.5 },
  { m: "F", d: 0.5 },
  { m: "G", d: 1 },
  { m: "G", d: 1 },
  { m: "A", d: 0.5 },
  { m: "A", d: 0.5 },
  { m: "A", d: 0.5 },
  { m: "A", d: 0.5 },
  { m: "G", d: 2 },
  { m: "A", d: 0.5 },
  { m: "A", d: 0.5 },
  { m: "A", d: 0.5 },
  { m: "A", d: 0.5 },
  { m: "G", d: 2 },
  { m: "F", d: 0.5 },
  { m: "F", d: 0.5 },
  { m: "F", d: 0.5 },
  { m: "F", d: 0.5 },
  { m: "E", d: 1 },
  { m: "E", d: 1 },
  { m: "D", d: 0.5 },
  { m: "D", d: 0.5 },
  { m: "D", d: 0.5 },
  { m: "D", d: 0.5 },
  { m: "C", d: 2 },
]
```

Not using an object (or using an object with m param), will default to sequential/monophonic timing.
This means that you do not have to provide a time value. The time value will be calculated by adding all previous durations together. But I think the nested notation is really powerful. I also plan to implement a string parser that would make the same melody even shorter:

```js
"C D E F . G G . A A A A . G . A A A A . G . F F F F . E E . D D D D . C"
```

Another thing that was adressed in this thread is "western" bias in the format.
This format has no "bias" as it does not even care what the end primitive values mean.
You could use the same syntax with chord symbols or your favorite papua neuginean sign system.
Time is a concept that is is universal, and with nested notation, you can express the wildest polyrhythms of your dreams:

```js
const _3vs2 = {
  p: [
    [1, 1, 1],
    [1, 1]
  ]
};
const _3vs4 = {
  p: [
    [1, 1, 1],
    [1, 1, 1, 1]
  ];
}
```

I also dont understand why you talk about music theory as some kind of mystic thing or some kind of non provable semi-logical thing. I don't know which theory books you've read but I think most people that spend their days making music (including non western) have a clear understanding of the connection between music theory and the underlying physics. Of course the twelve
