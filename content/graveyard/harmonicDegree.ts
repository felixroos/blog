import { Note } from "@tonaljs/tonal"

export function harmonicDegree(pitch, rotate = 0.55, flip = true) {
  const chroma = Note.chroma(pitch);
  const circleChromas = Array.from({ length: 12 }, (_, i) => (i * 5) % 12);
  const deg = (circleChromas.indexOf(chroma) / 12 + rotate) % 1;
  if (flip) {
    return 1 - deg;
  }
  return deg;
}