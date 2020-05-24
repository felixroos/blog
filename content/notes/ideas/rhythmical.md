# finding a textual format for musical expression

- This file documents my process of finding the idea of the [extended rhythmical format](https://felixroos.github.io/rhythmical/).
- Up to this point I had already implemented the [basis of rhythmical](https://github.com/felixroos/rhythmical), which is the nested array syntax (similar to tidalcycles), but I had not found a solution for polyphony, other than [writing multiple Tone.js schedulers](https://github.com/felixroos/rhythmical#polyrythms).
- I found inspiration after reading through [this issue](https://github.com/soundio/music-json/issues/2) and by reading through "Lisp as a second language", which implements the idea of parallel and sequential musical structures in nested lists
- I tried to search for a way of combining the nested array notation with the parallel and sequential approach, using json format
- Though it might look like it, I did not intend to write a teardown of the [musicJSON proposal](https://github.com/soundio/music-json), it just acted as a starting point that got me puzzled, trying to find a better solution
- The format proposed in musicJSON is perfectly fine for many use cases (as it is essentially midi with meta data in json), I just don't think it is a format that expresses music in a musical way, being only suitable to be processed by machines rather by humans
- If you have questions, arguments, ideas or similar, you leave me a message [at github](https://github.com/felixroos/)
- [I have implemented the format with many additions](https://felixroos.github.io/rhythmical/)


## [original musicJSON proposal](https://github.com/soundio/music-json#music-json-proposal)

```json
{
  "name": "Dolphin Dance",
  "events": [
    [2, "note", 76, 0.8, 0.5],
    [2.5, "note", 77, 0.6, 0.5],
    [3, "note", 79, 1, 0.5],
    [3.5, "note", 74, 1, 3.5],
    [10, "note", 76, 1, 0.5],
    [0, "chord", "C", "∆", 4],
    [4, "chord", "G", "-", 4]
  ],
  "interpretation": {
    "time_signature": "4/4",
    "key": "C",
    "transpose": 0
  }
}
```

# ideas for optimization

## idea 1: use object syntax for being independent of param ordering:

```json
[
  { "t": 2, "note": 76, "v": 0.8, "d": 0.5 },
  { "t": 2.5, "note": 77, "v": 0.6, "d": 0.5 },
  { "t": 3, "note": 79, "v": 1, "d": 0.5 },
  { "t": 3.5, "note": 74, "v": 1, "d": 3.5 },
  { "t": 10, "note": 76, "v": 1, "d": 0.5 },
  { "t": 0, "chord": "C", "symbol": "∆", "d": 4 },
  { "t": 4, "chord": "G", "symbol": "-", "d": 4 }
]
```

- t = time => defaults to 0
- v = velocity => defaults to 1
- d = duration => defaults to 1

### benefits of object syntax

- readability
- flexibility => can move properties around
- easy manipulation using object destructuring
- can set default values and omit them

### drawbacks of object syntax

- more verbose
- can be solved with primitive optimization (for many common use cases), see below

### optimization: value attribute + type

Currently we have chord and note attributes. It would be slicker to have a more open value attribute + an optional type:

```json
[
  { "t": 2, "value": 76, "v": 0.8, "d": 0.5 },
  { "t": 2.5, "value": 77, "v": 0.6, "d": 0.5 },
  { "t": 3, "value": 79, "v": 1, "d": 0.5 },
  { "t": 3.5, "value": 74, "v": 1, "d": 3.5 },
  { "t": 10, "value": 76, "v": 1, "d": 0.5 },
  { "t": 0, "value": "C∆", "type": "chord", "d": 4 },
  { "t": 4, "value": "G-", "type": "chord", "d": 4 }
]
```

- Now the default type is 'note'
- Also, i removed the symbol attribute and concatted them to the value.
  - I see no reason why those should be seperated as it is totally possible to parse those (e.g. see tonal lib).

### primitive shorthand notation

We could allow primitves (= strings or numbers) to drastically cut the characters for events that happen all at the same time like chords:

```js
const cMajorStrings = ["C3", "E3", "G3"]
const cMajorNumbers = [61, 65, 68]
```

Using default values strings can then be converted to

```js
const cMajorStrings = [
  { value: "C3", d: 1, v: 1, t: 0 },
  { value: "E3", d: 1, v: 1, t: 0 },
  { value: "E3", d: 1, v: 1, t: 0 },
]
const cMajorNumbers = [
  { value: 61, d: 1, v: 1, t: 0 },
  { value: 65, d: 1, v: 1, t: 0 },
  { value: 68, d: 1, v: 1, t: 0 },
]
```

### typescript interfaces

Lets formulate typescript interfaces for the current state of our object:

```ts
interface AbsoluteEvent<T> T | {
	t: number = 0,
  value: T,
  type: string = 'note',
	v: number = 1,
  d: number = 1
}
declare type AbsoluteEvents = AbsoluteEvent<any>[];
```

## idea 2: relative time

Lets add a feature that approaches the way humans read and write music:

- get rid of absolute time
- introduce rests

```json
[
  { "t": 0, "d": 4, "value": "C∆", "type": "chord" },
  { "d": 2, "type": "rest" },
  { "d": 0.5, "value": 76, "v": 0.8 },
  { "d": 0.5, "value": 77, "v": 0.6 },
  { "d": 0.5, "value": 79 },
  { "d": 3.5, "value": 74 },
  { "t": 4, "d": 4, "value": "G-", "type": "chord" },
  { "d": 1, "type": "rest" },
  { "d": 2, "type": "rest" },
  { "d": 0.5, "value": 76 }
]
```

- t can still be set => object is treated absolute

### conversion to absolute time

To make this machine readable / playable, we can easily calculate the absolute time value for each event by adding all previous durations (of non absolute events) together:

```json
[
  { "t": 0, "d": 4, "value": "C∆", "type": "chord" },
  { "t": 0, "d": 2 },
  { "t": 2, "d": 0.5, "value": 76, "v": 0.8 },
  { "t": 2.5, "d": 0.5, "value": 77, "v": 0.6 },
  { "t": 3, "d": 0.5, "value": 79 },
  { "t": 3.5, "d": 3.5, "value": 74 },
  { "t": 4, "d": 4, "value": "G-", "type": "chord" },
  { "t": 7, "d": 1 }, // rest
  { "t": 8, "d": 2 }, // rest
  { "t": 10, "d": 0.5, "value": 76 }
]
```

- Note that the chord events stay like they are + their duration is ignored for calculation (because they have t defined)

> The need to keep absolute time values for the chords conveys a limitation of relative time: _It can only express monophonic sequences_. We will find a much neater abstraction for this later.

### primitive shorthand notation

Like before, we could further optimize the relative format by allowing primitives (= numbers or strings) instead of objects:

```js
const cMajorNumbers = [61, 62, 63, 64, 65, 66, 67, 68]
const cMajorStrings = ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"]
```

those strings could be interpreted as values:

```js
const cMajorNumbers = [
  { value: 61 },
  { value: 62 },
  { value: 63 },
  { value: 64 },
  { value: 65 },
  { value: 66 },
  { value: 67 },
  { value: 68 },
]
const cMajorStrings = [
  { value: "C3" },
  { value: "D3" },
  { value: "E3" },
  { value: "F3" },
  { value: "G3" },
  { value: "A3" },
  { value: "B3" },
  { value: "C4" },
]
```

which, with added defaults, would result in:

```json
[
  { "value": "C3", "d": 1, "v": 1 },
  { "value": "D3", "d": 1, "v": 1 },
  { "value": "E3", "d": 1, "v": 1 },
  { "value": "F3", "d": 1, "v": 1 },
  { "value": "G3", "d": 1, "v": 1 },
  { "value": "A3", "d": 1, "v": 1 },
  { "value": "B3", "d": 1, "v": 1 },
  { "value": "C4", "d": 1, "v": 1 }
]
```

... which could be transformed to absolute time by adding all previous durations together:

```json
[
  { "value": "C3", "t": 0, "d": 1, "v": 1 },
  { "value": "D3", "t": 1, "d": 1, "v": 1 },
  { "value": "E3", "t": 2, "d": 1, "v": 1 },
  { "value": "F3", "t": 3, "d": 1, "v": 1 },
  { "value": "G3", "t": 4, "d": 1, "v": 1 },
  { "value": "A3", "t": 5, "d": 1, "v": 1 },
  { "value": "B3", "t": 6, "d": 1, "v": 1 },
  { "value": "C4", "t": 7, "d": 1, "v": 1 }
]
```

... which can now be parsed easily.

### typescript interfaces

Lets formulate typescript interfaces for that:

```ts
interface RelativeEvent<T> = T | {
  d: number = 1, // duration
  value?: T,
  type: string = 'note',
  v: number = 1, // volume
}
type RelativeEvents = RelativeEvent[];
type MixedEvents = Array<RelativeEvent<any> | AbsoluteEvent<any>>;
```

### benefits for relative time:

1. less edits required for common operations
2. better readability

> _axiom_: a good format will always require less edits/keystrokes for common operations
> common operations: inserting bars, removing bars, duplicating measures

examples where less edits are beneficial:

- version control
- writing by hand / live coding

### edit example 1: removing bars with absolute time

image those two bars in absolute time notation:

example:

```js
const absoluteBars = [
  // first measure
  { t: 0 /* .. */ },
  { t: 1 /* .. */ },
  { t: 1.5 /* .. */ },
  { t: 2 /*..*/ },
  // second measure
  { t: 4 /* .. */ },
  { t: 4.5 /* .. */ },
  { t: 5 /* .. */ },
  { t: 6 /*..*/ },
  { t: 7 /*..*/ },
]
```

if we want to remove the first bar, we need to adjust subtract 4 beats from all notes that come after.
this would be the end result:

```js
const absoluteBarsEdited = [
  // second measures
  { t: 0 /* .. */ },
  { t: 0.5 /* .. */ },
  { t: 1 /* .. */ },
  { t: 2 /*..*/ },
  { t: 3 /*..*/ },
]
```

if we would not subtract 4 beats, we would have one measure silence.

similar to that, if we want to duplicate a phrase, we need to adjust all numbers.
if we duplicate without further adjustments, we have the same phrase at the same position => not useful

same thing applies for moving stuff around.

### edit example 2: removing bars with relative time

imagine the same bars in relative notation:

```js
const relativeBars = [
  // first measure
  { d: 1 /* .. */ },
  { d: 0.5 /* .. */ },
  { d: 0.5 /* .. */ },
  { d: 2 /*..*/ },
  // second measures
  { d: 0.5 /* .. */ },
  { d: 0.5 /* .. */ },
  { d: 1 /* .. */ },
  { d: 1 /*..*/ },
  { d: 1 /*..*/ },
]
```

if we want to remove the first bar, we can just remove it and the rest will automatically be placed at the start.
if we really wanted to behave it as the absolute format does, we can just insert a bar rest:

```js
const relativeBarsWithRest = [
  // first measure
  {d: 4, type: "rest" },
  // second measures
  {t: 0.5, /* */ }
  {t: 0.5, /* */ }
  {t: 1, /* */ }
  {t: 1, /* */ }
  {t: 1, /* */ }
]
```

## idea 3: combining absolute and relative events through nesting

```ts
interface RelativeEvent<T> = T | {
  d: number = 1,
  value?: T,
  type: string = 'note',
  v: number = 1,
}

interface AbsoluteEvent<T> T | {
  t: number = 0,
  d: number = 1,
  value: T,
  type: string = 'note',
  v: number = 1,
}
```

By comparing the two events, we see they are almost the same, except the t property. We could combine both:

```ts
interface Event<T> T | {
  t?: number; // if set, event is treated absolute
  d: number = 1
  value: T | T[]; // add possibility to use array
  type: string = 'note',
  v: number = 1;
}
```

and add a nested array type:

```ts
interface NestedArray<T> extends Array<T | NestedArray<T>>;
declare type NestedEvent = NestedArray<Event<string>>;
```

Now we can endlessly nest events into each other

e.g. a chord sequence could like this:

```json
[
  {
    "type": "relative",
    "value": [
      { "type": "absolute", "value": ["C3", "E3", "G3"] },
      { "type": "absolute", "value": ["C3", "F3", "A3"] },
      { "type": "absolute", "value": ["D3", "G3", "B3"] }
    ]
  }
]
```

If we would express this as a hard coded type, this would be:

```ts
interface MyChordSequence = Array<Event<Array<Event<string[]>>>>
```

Now lets think through how this would be converted to absolute, non nested events.

### peeling the onion

Lets imagine how the algorithm would resolve this nested structure. Note that the following process will not be the end algorithm but just an illustration of how it might work.

The type now affects how children are given their default values. On the outer most event, deafault values are added + the children (layer 2) are treated relative (adding up default values):

```js
const peeled = [
  // layer 1
  {
    t: 0,
    d: 1,
    v: 1,
    type: "relative",
    value: [
      // layer 2
      { t: 0, d: 1, v: 1, type: "absolute", value: ["C3", "E3", "G3"] },
      { t: 1, d: 1, v: 1, type: "absolute", value: ["C3", "F3", "A3"] },
      { t: 2, d: 1, v: 1, type: "absolute", value: ["D3", "G3", "B3"] },
    ],
  },
]
```

Now having absolute times on the first and second layer, we can multiply the outer duration with all inner durations and times (nothing spectacular happens as all durations are 1) and then add the times together. This way we can remove the outer layer as it is now represented in the second level:

```js
const peeled = [ // layer 2
  { t: 0, d: 1, v: 1, type: "absolute", value: ["C3", "E3", "G3"] },
  { t: 1, d: 1, v: 1, type: "absolute", value: ["C3", "F3", "A3"] },
  { t: 2, d: 1, v: 1, type: "absolute", value: ["D3", "G3", "B3"] },
],
```

Now we can convert the strings in the third layer to objects with default values:

The whole object now looks like that:

```js
const peeled = [
  // former layer 2
  {
    t: 0,
    d: 1,
    v: 1,
    type: "absolute",
    value: [
      // former layer 3
      { value: "C3", t: 0, d: 1, v: 1 },
      { value: "E3", t: 0, d: 1, v: 1 },
      { value: "G3", t: 0, d: 1, v: 1 },
    ],
  },
  {
    t: 1,
    d: 1,
    v: 1,
    type: "absolute",
    value: [
      { value: "C3", t: 0, d: 1, v: 1 },
      { value: "F3", t: 0, d: 1, v: 1 },
      { value: "A3", t: 0, d: 1, v: 1 },
    ],
  },
  {
    t: 2,
    d: 1,
    v: 1,
    type: "absolute",
    value: [
      { value: "D3", t: 0, d: 1, v: 1 },
      { value: "G3", t: 0, d: 1, v: 1 },
      { value: "B3", t: 0, d: 1, v: 1 },
    ],
  },
]
```

Now, again, we can combine the times and duration by multiplying durations and adding times together:

```js
const peeled = [
  { value: "C3", t: 0, d: 1, v: 1 },
  { value: "E3", t: 0, d: 1, v: 1 },
  { value: "G3", t: 0, d: 1, v: 1 },
  { value: "C3", t: 1, d: 1, v: 1 },
  { value: "F3", t: 1, d: 1, v: 1 },
  { value: "A3", t: 1, d: 1, v: 1 },
  { value: "D3", t: 2, d: 1, v: 1 },
  { value: "G3", t: 2, d: 1, v: 1 },
  { value: "B3", t: 2, d: 1, v: 1 },
]
```

Thats it! We have successfully turned the nested object into a single layer array with absolute events.
This was just a non formal proof that this could be done with an algorithm.

### optimization 1: extra attributes to eliminate type

as an alternative to the type / value combination, we could add extra attributes for absolute and relative children:

chord sequence before:

```js
const before = [
  {
    type: "relative",
    value: [
      { type: "absolute", value: ["C3", "E3", "G3"] },
      { type: "absolute", value: ["C3", "F3", "A3"] },
      { type: "absolute", value: ["D3", "G3", "B3"] },
    ],
  },
]
```

after:

```js
const after = [
  {
    relative: [
      { absolute: ["C3", "E3", "G3"] },
      { absolute: ["C3", "F3", "A3"] },
      { absolute: ["D3", "G3", "B3"] },
    ],
  },
]
```

This is much more compact and readable!

#### Other possible wordings

one good metaphor would be electric circuits, which work just like our timing system:

```js
const circuit = [
  {
    series: [
      { parallel: ["C3", "E3", "G3"] },
      { parallel: ["C3", "F3", "A3"] },
      { parallel: ["D3", "G3", "B3"] },
    ],
  },
]
```

another would be using daw wording:

```js
const song = [
  {
    sequence: [
      { tracks: ["C3", "E3", "G3"] },
      { tracks: ["C3", "F3", "A3"] },
      { tracks: ["D3", "G3", "B3"] },
    ],
  },
]
```

or like in the lisp paper:

```js
const music = [
  {
    sequential: [
      { parallel: ["C3", "E3", "G3"] },
      { parallel: ["C3", "F3", "A3"] },
      { parallel: ["D3", "G3", "B3"] },
    ],
  },
]
```

I'll stick to relative / absolute for now but this may change in the implementation

### optimization 2: relative as default mode

Another great optimization is using relative as default, so we can just use an array:

instead of this

```json
[
  {
    "relative": [
      { "absolute": ["C3", "E3", "G3"] },
      { "absolute": ["C3", "F3", "A3"] },
      { "absolute": ["D3", "G3", "B3"] }
    ]
  }
]
```

that:

```json
[
  { "absolute": ["C3", "E3", "G3"] },
  { "absolute": ["C3", "F3", "A3"] },
  { "absolute": ["D3", "G3", "B3"] }
]
```

So each array is treated as relative, as long it is not the value of an "absolute" attribute.

This enables us to write:

```json
["C3", ["D3", "E3"], "F3", ["D3", "E3"]]
```

which could be interpreted as

- a quarter note
- followed by two eights notes
- followed by a quarter note
- followed by two eights notes

This is the same notation principle that tidalcycles uses.

Resolving the default mode:

```json
{
  "relative": [
    "C3",
    { "relative": ["D3", "E3"] },
    "F3",
    { "relative": ["D3", "E3"] }
  ]
}
```

Resolving strings to objects:

```json
{
  "relative": [
    { "value": "C3" },
    { "relative": [{ "value": "D3" }, { "value": "E3" }] },
    { "value": "F3" },
    { "relative": [{ "value": "D3" }, { "value": "E3" }] }
  ]
}
```

peeling off layer 1:

```json
[
  { "t": 0, "d": 1, "value": "C3" },
  { "t": 1, "d": 1, "relative": [{ "value": "D3" }, { "value": "E3" }] },
  { "t": 2, "d": 1, "value": "F3" },
  { "t": 3, "d": 1, "relative": [{ "value": "D3" }, { "value": "E3" }] }
]
```

adding default values to layer 2

```json
[
  { "t": 0, "d": 1, "value": "C3" },
  {
    "t": 1,
    "d": 1,
    "value": [
      { "t": 0, "d": 1, "value": "D3" },
      { "t": 1, "d": 1, "value": "E3" }
    ]
  },
  { "t": 2, "d": 1, "value": "F3" },
  {
    "t": 3,
    "d": 1,
    "value": [
      { "t": 0, "d": 1, "value": "D3" },
      { "t": 1, "d": 1, "value": "E3" }
    ]
  }
]
```

peeling off layer 2:

```json
[
  { "t": 0, "d": 1, "value": "C3" },
  { "t": 1, "d": 0.5, "value": "D3" },
  { "t": 1.5, "d": 0.5, "value": "E3" },
  { "t": 2, "d": 1, "value": "F3" },
  { "t": 3, "d": 0.5, "value": "D3" },
  { "t": 3.5, "d": 0.5, "value": "E3" }
]
```

Note that we need to divide time and duration by the number of children in a group to resolve it! This will later be done by the algorithm using arrays of fractions.

### Polyphony example

We could arrange multiple tracks like that:

```js
const backbeat = {
  absolute: [
    ["bd", "~", "bd", "~"], //bassdrum
    ["hh", "hh", "hh", "hh", "hh", "hh", "hh"], //hihat
    ["~", "sd", "~", "sd"], //snaredrum
  ],
}
```

Note that the inner arrays will still be relative by default, as the absolute param only tells that the next level will be absolute. It will resolve like that:

```js
{
  absolute: [
    { relative: ["bd", "~", "bd", "~"] },
    { relative: ["hhhh", "hh", "hh", "hh", "hh", "hh", "hh"] },
    { relative: ["~", "snare", "~", "snare"] },
  ],
}
```

This has now been implemented! Have a look at [rhythmical REPL](https://felixroos.github.io/rhythmical/)