---
title: WASM
date: 2020-12-08
---

## AssemblyScript

> Prequisite: make sure node.js >= 13 is installed. Tip: use `nvm install 14.5.1 && nvm use 14.5.1`

[Quick Start](https://www.assemblyscript.org/quick-start.html):

```sh
mkdir wasm && cd wasm
npm init
npm install --save @assemblyscript/loader
npm install --save-dev assemblyscript
npx asinit .
npm run asbuild
npm test
```

### import with node.js

now we can import the module in a node.js script:

```js
const { add } = require('./index');
console.log(add(7, 2));
```

```sh
node adder.js
9
```

### import with browser

in a browser context, the import goes like this:

## wasm music

### javascriptmusic

- [wasm-music yt](https://www.youtube.com/watch?v=1Hqy7cVkygU)
- [repo](https://github.com/petersalomonsen/javascriptmusic)
- [demo](https://petersalomonsen.com/webassemblymusic/livecodev2/?gist=5b795090ead4f192e7f5ee5dcdd17392)

> can also download wasm modules from there (top right corner)
> can also download mod files (amiga protracker module) [here](https://petersalomonsen.github.io/javascriptmusic/wasmaudioworklet/?gist=6ba8fd149e8bee48a37281ba02cfca45)

### playing modules

install [wasmer](https://docs.wasmer.io/ecosystem/wasmer/getting-started):

```sh
curl https://get.wasmer.io -sSfL | sh
```

```sh
wasmer song.wasm | sox -S -t raw -b 32 -e float -r 48000 -c 2 - -d # live
wasmer song.wasm | sox -S -t raw -b 32 -e float -r 48000 -c 2 - song.wav # to file
```

- [some wasm files here](https://github.com/wasm3/wasm3/tree/master/test/benchmark/wasmsynth#wasm-synth)

=> this seems to work much better than with wasm3.

### possibly obsolete: wasm3

Before finding out that wasmer can be used directly to run the wasm files, I tried using [wasm3](https://github.com/wasm3/wasm3).
Problem: when installing wasm3 through wapm, it fails to run, similar to [this issue](https://github.com/wasm3/wasm3/issues/135).
clone [repo](https://github.com/wasm3/wasm3), read [docs](https://github.com/wasm3/wasm3/blob/master/docs/Development.md#wasm3-development-notes).

```sh
mkdir -p build
cd build
cmake ..
make -j8 # emits wasm3 binary
```
