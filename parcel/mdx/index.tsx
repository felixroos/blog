import * as React from "react"
import * as ReactDOM from "react-dom"
// @ts-ignore
import TestComponent from "../Test.mdx"
ReactDOM.render(<TestComponent />, document.getElementById("mdx")) 
// 1.2MB on serve
// 147kB for prod build
