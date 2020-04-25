/* import "@babel/polyfill" */
// @ts-ignore
import App from "./App.svelte"
import ReactApp from "./ReactApp"
import * as React from "react"
import * as ReactDOM from "react-dom"
// @ts-ignore
import TestComponent from "./Test.mdx"
ReactDOM.render(<ReactApp />, document.getElementById("react")) // 1.2MB
ReactDOM.render(<TestComponent />, document.getElementById("mdx")) // 1.2MB

new App({
  target: document.getElementById("svelte"),
  data: {
    name: "world",
  },
}) // 99kB
