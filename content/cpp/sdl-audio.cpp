#include <SDL2/SDL.h>

int main(int argc, char **argv)
{
  SDL_Init(SDL_INIT_EVERYTHING);
  SDL_Window *screen = SDL_CreateWindow("My Game Window",
                                        SDL_WINDOWPOS_UNDEFINED,
                                        SDL_WINDOWPOS_UNDEFINED,
                                        640, 480,
                                        SDL_WINDOW_OPENGL);
  bool running = true;
  while (running)
  {
    SDL_Event event;
    while (SDL_PollEvent(&event))
    {
      switch (event.type)
      {
      case SDL_QUIT:
        running = false;
        break;
      }
    }
    // logic & render
    //SDL_RenderPresent(screen);
  }
  SDL_Quit();
  return 0;
}