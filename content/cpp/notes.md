# notes

configured debug task:

just run debug and open the debug console

this is how you can rebuild and run: (after brew install entr)

```sh
ls | entr -s '/usr/bin/clang++ -std=c++17 -stdlib=libc++ -g /Users/felix/projects/blog/content/cpp/hello.cpp -o /Users/felix/projects/blog/content/cpp/hello && ./hello'
```

TBD: use cmake then do

```sh
ls _.cpp | entr -s 'make && make test'
```

## links

- [entr](http://eradman.com/entrproject/)
- https://stackoverflow.com/questions/2481269/how-to-make-a-simple-c-makefile
- https://cmake.org/
- also checkout https://code.visualstudio.com/docs/languages/cpp
- http://www.sdltutorials.com/sdl-tutorial-basics
- http://www.david-amador.com/2011/06/playing-sound-using-openal/
- https://indiegamedev.net/2020/02/15/the-complete-guide-to-openal-with-c-part-1-playing-a-sound/
- https://emscripten.org/docs/porting/Audio.html
