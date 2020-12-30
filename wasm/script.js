fetch('build/untouched.wasm')
  .then((response) => {
    return response.arrayBuffer();
  })
  .then((buffer) => WebAssembly.instantiate(buffer, {}).then((obj) => console.log(obj.instance.exports)));
