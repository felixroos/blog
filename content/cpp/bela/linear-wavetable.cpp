float linearWavetable(float frequency, float *gReadPointer, int sampleRate)
{
  // The pointer will take a fractional index. Look for the sample on
  // either side which are indices we can actually read into the buffer.
  // If we get to the end of the buffer, wrap around to 0.
  int indexBelow = floorf(*gReadPointer);
  int indexAbove = indexBelow + 1;
  if (indexAbove >= gWavetableLength)
    indexAbove = 0;

  // For linear interpolation, we need to decide how much to weigh each
  // sample. The closer the fractional part of the index is to 0, the
  // more weight we give to the "below" sample. The closer the fractional
  // part is to 1, the more weight we give to the "above" sample.
  float fractionAbove = *gReadPointer - indexBelow;
  float fractionBelow = 1.0 - fractionAbove;
  // Calculate the weighted average of the "below" and "above" samples
  float out = fractionBelow * gWavetable[indexBelow] + fractionAbove * gWavetable[indexAbove];
  *gReadPointer += gWavetableLength * frequency / sampleRate;

  while (*gReadPointer >= gWavetableLength)
    *gReadPointer -= gWavetableLength;

  return out;
}