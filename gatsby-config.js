module.exports = {
  pathPrefix: "/blog",
  plugins: [
    {
      resolve: `gatsby-theme-notes`,
      options: {
        // basePath defaults to `/`
        basePath: `/notes`,
      },
    },
    {
      resolve: `gatsby-theme-blog`,
      options: {
        mdxOtherwiseConfigured: false,
      },
    },
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true, // defaults to false
        //jsxPragma: `jsx`, // defaults to "React"
        allExtensions: true, // defaults to false
      },
    },
  ],
  // Customize your site metadata:
  siteMetadata: {
    title: `Loophole Letters`,
    author: `Felix Roos`,
    description: `About Music & Coding`,
    social: [
      {
        name: `github`,
        url: `https://github.com/felixroos`,
      },
    ],
  },
}
