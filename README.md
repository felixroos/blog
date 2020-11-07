## /content

- /components: react components used by blog posts / notes
- [/notes](https://felixroos.github.io/blog/notes): writings and component testing not (yet) suitable for blog
- [/blog](https://felixroos.github.io/blog/): blog posts
page counter https://loopholeletters.goatcounter.com/

## todo

### implement stateful tree walker

- [x] generator function that walks one node per call
- [x] enables "debugging" tree walker with Tree component
- [ ] could show different states on the side
- [ ] the generator could also be used to run inside a tone.js loop to "buffer" events as long as required
  - this would eliminate loop errors => for example, the first chord could then be voiced based on the last
  - the walker could be adjusted to be a "runtime", that allows jumps (to implement control flow)
  - maybe a zipper like implementation would then be needed
  - nevertheless, the stateful tree walker should still be implemented!!!

### PianoRoll

- add mode for PianoRoll where non-leaves are rendered => display bolero with group colors
- add mode for PianoRoll where nothing is scrolling, just the playhead is moving
- place non-scrolling PianoRoll with 0s on the left under the bolero score to replace colored bars
- auto select nodes in the graph while playing (to show correlation)

### Tree / RhythmInspector

- [x] adapt rhythmicalHierarchy, making it work with rhythmical objects too (currently array only) => r2d3
- add mode for Tree where clicking a node results in all the parent nodes being colored (+ node itself)
- add RhythmInspector, which is a rhythmical Tree that enables selecting nodes

## RhythmEditor

- add RhythmEditor, which is Player + JSON editor + RhythmInspector, that automatically updates
- Make RhythmInspector editable
  - nodes can be disabled (won't play + will loose color)
  - nodes can be edited => change value, set instrument, velocity, duration etc..

## Score

- improve Score component to allow rhythmical objects too (currently array only)
- improve Score component to show tuplets
- replace bolero.png with Score + color note heads + stems + beams according to group
