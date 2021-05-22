const { Note, Scale } = require('@tonaljs/tonal');
const { curry, compose, pipe, __ } = require('ramda');
const { inspect, match, prop, add, map } = require('./magtfp');

class Container {
  constructor(x) {
    this.$value = x;
  }

  static of(x) {
    return new Container(x);
  }

  // implementing map makes Container a valid functor
  map(f) {
    return Container.of(f(this.$value));
  }
}

test('Container.of', () => {
  Container.of(3);
  // Container(3)
  // expect(Container.$value).toBe(3);

  Container.of('hotdogs');
  // Container("hotdogs")

  Container.of(Container.of({ name: 'yoda' }));
  // Container(Container({ name: 'yoda' }))
});

test('Container.map', () => {
  let c = Container.of(2).map((two) => two + 2);
  expect(c.$value).toBe(4);

  const add = curry((a, b) => a + b);

  c = Container.of(2).map(add(3));

  expect(c.$value).toBe(5);

  const map = curry((f, functor) => functor.map(f));

  c = map(add(3), Container.of(3));
  expect(c.$value).toBe(6);

  c = compose(map(add(3)), Container.of);
  expect(c(3).$value).toBe(6);

  c = compose(map(add(3)), map(add(2)), Container.of);
  expect(c(3).$value).toBe(8);

  c = Container.of(3).map(compose(add(3), add(2)));
  expect(c.$value).toBe(8);
});

class Maybe {
  static of(x) {
    return new Maybe(x);
  }

  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  constructor(x) {
    this.$value = x;
  }

  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }

  inspect() {
    return this.isNothing ? 'Nothing' : `Just(${inspect(this.$value)})`;
  }
}

test('Maybe', () => {
  let m;
  m = Maybe.of('Malkovich Malkovich').map(match(/a/gi));
  expect(m.inspect()).toBe('Just(true)');

  m = Maybe.of(null).map(match(/a/gi));
  expect(m.inspect()).toBe('Nothing');

  m = Maybe.of({ name: 'Boris' }).map(prop('age')).map(add(10));
  expect(m.inspect()).toBe('Nothing');

  m = Maybe.of({ name: 'Dinah', age: 14 }).map(prop('age')).map(add(10));
  expect(m.inspect()).toBe('Just(24)');

  m = Maybe.of({ name: 'Dinah', age: 14 }).map(pipe(prop('age'), add(11)));
  expect(m.inspect()).toBe('Just(25)');

  m = pipe(Maybe.of, map(prop('age')), map(add(12)));
  expect(m({ name: 'Dinah', age: 14 }).inspect()).toBe('Just(26)');

  m = pipe(Maybe.of, map(prop('age')), map(add(12)));
  expect(m({ name: 'Dinah' }).inspect()).toBe('Nothing');

  m = pipe(Maybe.of, map(pipe(prop('age'), add(13))));
  expect(m({ name: 'Dinah', age: 14 }).inspect()).toBe('Just(27)');

  // m = pipe(Maybe.of, map(pipe(prop('age'), add(13))));
  // expect(m({ name: 'Dinah' }).inspect()).toBe('Nothing');
  // safeHead :: [a] -> Maybe(a)
  const safeHead = (xs) => Maybe.of(xs[0]);

  // streetName :: Object -> Maybe String
  const streetName = compose(map(prop('street')), safeHead, prop('addresses'));

  m = streetName({ addresses: [] });
  expect(m.inspect()).toBe('Nothing');

  m = streetName({ addresses: [{ street: 'Shady Ln.', number: 4201 }] });
  expect(m.inspect()).toBe(`Just('Shady Ln.')`);
  // Just('Shady Ln.')
});

test('fp tonal', () => {
  const transpose = curry((interval, note) => Note.transpose(note, interval));
  expect(transpose('3M', 'C3')).toBe('E3');
  const indices = curry((ids, array) => array.filter((_, i) => ids.includes(i)));
  expect(indices([0, 2], ['A', 'B', 'C'])).toEqual(['A', 'C']);
  expect(indices(__, ['A', 'B', 'C'])([0, 2])).toEqual(['A', 'C']);
  const numberRange = curry((a, b) => Array.from({ length: b - a + 1 }, (_, n) => n + a));
  expect(numberRange(1, 3)).toEqual([1, 2, 3]);
  const diff = curry((a, b) => a - b);
  expect(diff(__, 9)(10)).toBe(1);

  expect(indices([1, 3, 5])('ABCDEFG'.split('')).join('')).toEqual('BDF');

  const stepChord = curry((step, scale) => pipe(() => [0, 2, 4], map(add(step)), indices(__, scale))());
  const scaleNotes = (scale) => Scale.get(scale).notes;
  expect(stepChord(1, scaleNotes('C major'))).toEqual(['D', 'F', 'A']);
  const stepChords = (scale) =>
    pipe(scaleNotes, prop('length'), numberRange(0), map(stepChord(__, scaleNotes(scale))))(scale);
  expect(stepChords('C major')).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
});

test('maybe', () => {
  // maybe :: b -> (a -> b) -> Maybe a -> b
  const maybe = curry((v, f, m) => {
    if (m.isNothing) {
      return v;
    }

    return f(m.$value);
  });
});
