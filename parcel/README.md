# Parcel Showdown

did a showdown of react vs mdx vs svelte in parcel folder, measuring bundle sizes for dev / prod:

1. svelte: 42kB / 99kB
2. react: 133kB / 1.2MB
3. mdx: 147kB / 1.2MB

so svelte is the clear winner of bundle size..
But svelte does not come with a huge community + thousands of ready to use components
Also, MDX is really convenient for writing + direct feedback using MDX preview.
I think the bundle size different will also be not that much dramatic if the code size increases.
So I assume using react could have a fixed ~120kB extra load on average.
Also, svelte parcel loader only worked when using "browserslist": "last 1 chrome versions", see https://github.com/parcel-bundler/parcel/issues/839#issuecomment-421934717
=> have to recheck when parcel 2 is out..

## Setup Steps

### react

- works without plugin, just render with ReactDOM

### mdx

- followed https://mdxjs.com/getting-started/parcel check parcel folder
- had to add tsconfig: https://github.com/parcel-bundler/parcel/issues/1199#issuecomment-382432970
- currently, jsx fragments do not work: https://github.com/parcel-bundler/parcel/issues/1199#issuecomment-382432970
- moved everything to parcel subfolder with extra package.json as gatsby fails building with parcel stuff

- => could use pupeteer to screenshot state as parcel build on commit!

### svelte

- using https://www.npmjs.com/package/parcel-plugin-svelte
- needed "fix" https://github.com/parcel-bundler/parcel/issues/839#issuecomment-421934717
