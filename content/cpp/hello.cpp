#include <iostream>
#include <vector>
#include <string>

using namespace std;

int main()
{
    vector<string> msg {"Hello...", "C++", "World", "from", "VS Code", "and the C++ extension!!"};

    for (const string& word : msg)
    {
        cout << word << " ";
    }
    cout << endl;
}

/*
// this is how you can rebuild and run: (after brew install entr)
ls | entr -s '/usr/bin/clang++ -std=c++17 -stdlib=libc++ -g /Users/felix/projects/blog/content/cpp/hello.cpp -o /Users/felix/projects/blog/content/cpp/hello && ./hello'
// TBD: use cmake then do
ls *.cpp | entr -s 'make && make test'

http://eradman.com/entrproject/

// https://stackoverflow.com/questions/2481269/how-to-make-a-simple-c-makefile
// https://cmake.org/
// also checkout https://code.visualstudio.com/docs/languages/cpp
http://www.sdltutorials.com/sdl-tutorial-basics
http://www.david-amador.com/2011/06/playing-sound-using-openal/
https://indiegamedev.net/2020/02/15/the-complete-guide-to-openal-with-c-part-1-playing-a-sound/
https://emscripten.org/docs/porting/Audio.html
*/
