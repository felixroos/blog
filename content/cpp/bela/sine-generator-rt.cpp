#include <Bela.h>
#include <cmath>

float gFrequency = 110.0;
float gAmplitude = 0.6;

float gPhase = 0;

bool setup(BelaContext *context, void *userData)
{
  return true;
}

void render(BelaContext *context, void *userData)
{

  for (unsigned int n = 0; n < context->audioFrames; n++)
  {
    gPhase += 2.0 * M_PI * gFrequency / context->audioSampleRate;
    if (gPhase > 2.0 * M_PI)
    {
      gPhase -= 2.0 * M_PI;
    }
    float out = gAmplitude * sin(gPhase);

    for (unsigned int channel = 0; channel < context->audioOutChannels; channel++)
    {
      audioWrite(context, n, channel, out);
    }
  }
  gFrequency *= 1.00001;
}

void cleanup(BelaContext *context, void *userData)
{
}
 