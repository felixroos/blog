import React, { useRef, useEffect } from "react"
import StackblitzSdk from "@stackblitz/sdk"

export const Stackblitz = ({ project, options, children }) => {
  const container = useRef(null)
  project = {
    template: "typescript",
    description: "",
    files: {},
    tags: [],
    settings: {
      compile: {
        clearConsole: false,
      },
    },
    ...project,
  }
  options = {
    view: "editor",
    width: "100%",
    height: "400px",
    clickToLoad: false,
    hideExplorer: false,
    hidedevtools: true,
    hideNavigation: true,
    forceEmbedLayout: true,
    ...options,
  }

  React.Children.forEach(children, ({ props, type }) => {
    const { name, originalType, children, content, open } = props
    if ((originalType || type) === "file") {
      project = {
        ...project,
        files: {
          ...project.files,
          [name]: content || children,
        },
      }
      if (open !== undefined) {
        options = {
          openFile: name,
          ...options,
        }
      }
    }
  })
  useEffect(() => {
    if (container.current) {
      console.log("ebed", container.current)
      StackblitzSdk.embedProject(container.current, project, options)
    }
  }, [])
  return <div ref={container} />
}
