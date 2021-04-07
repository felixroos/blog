#include <chrono>
#include <thread>

#include "beeper.h"

void sleep(int duration)
{
  std::this_thread::sleep_for(
      std::chrono::milliseconds(duration));
}

int main()
{
  SDL_Init(SDL_INIT_AUDIO);
  Beeper::open();
  Beeper::setVolume(1.0);
  Beeper::play();

  const double e3 = 220 *3/4;
  const double a4 = 220;
  const double cs4 = 220 * 5 / 4;
  const double cs3 = 220 * 5 / 8;
  const double e4 = 220 * 3 / 2;

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);
  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);
  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);
  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);
  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);
  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::setFrequency(e3);
  sleep(300);
  Beeper::setFrequency(e4);
  sleep(300);

  Beeper::stop();
  Beeper::close();
  SDL_Quit();
  return 0;
}