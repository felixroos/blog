module.exports = {
  pathPrefix: '/blog',
  plugins: [
    {
      resolve: `gatsby-plugin-goatcounter`,
      options: {
        // REQUIRED! https://[my_code].goatcounter.com
        code: 'loopholeletters',
        // ALL following settings are OPTIONAL
        // Avoids sending pageview hits from custom paths
        exclude: [],
        // Delays sending pageview hits on route update (in milliseconds)
        pageTransitionDelay: 0,
        // Defines where to place the tracking script
        // boolean `true` in the head and `false` in the body
        head: false,

        // Set to true to include a gif to count non-JS users
        pixel: false,

        // Allow requests from local addresses (localhost, 192.168.0.0, etc.)
        // for testing the integration locally.
        // TIP: set up a `Additional Site` in your GoatCounter settings
        // and use its code conditionally when you `allowLocal`, example below
        allowLocal: true,
        // Override the default localStorage key more below
        localStorageKey: 'skipgc',
        // Set to boolean true to enable referrer set via URL parameters
        // Like example.com?ref=referrer.com or example.com?utm_source=referrer.com
        // Accepts a function to override the default referrer extraction
        // NOTE: No Babel! The function will be passes as is to your websites <head> section
        // So make sure the function works as intended in all browsers you want to support
        referrer: false,
        // Setting it to boolean true will clean the URL from
        // `?ref` & `?utm_` parameters before sending it to GoatCounter
        // It uses `window.history.replaceState` to clean the URL in the
        // browser address bar as well.
        // This is to prevent ref tracking ending up in your users bookmarks.
        // All parameters other than `ref` and all `utm_` will stay intact
        urlCleanup: false,
      },
    },
    {
      resolve: `gatsby-theme-notes`,
      options: {
        // basePath defaults to `/`
        basePath: `/notes`
      }
    },
    {
      resolve: `gatsby-theme-blog`,
      options: {
        mdxOtherwiseConfigured: false
      }
    },
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true, // defaults to false
        //jsxPragma: `jsx`, // defaults to "React"
        allExtensions: true // defaults to false
      }
    },
    { resolve: 'gatsby-theme-material-ui' }
  ],
  // Customize your site metadata:
  siteMetadata: {
    title: `Loophole Letters`,
    author: `Felix Roos`,
    description: `About Music & Coding`,
    social: [
      {
        name: `github`,
        url: `https://github.com/felixroos`
      }
    ]
  }
};
