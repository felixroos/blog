import "@babel/polyfill"
// @ts-ignore
import App from "../App.svelte"
new App({
  target: document.getElementById("svelte"),
})

// 99kB on serve
// 42kB for prod build
