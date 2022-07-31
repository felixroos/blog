import { useRef } from "react";
import useKeyHandler from "./useKeyHandler";

// TODO: replace with common useHotKeys

export default function useHotKeys({ keys, state, mute, down, up }: any, dep) {
  const hold = useRef<[string, any][]>([]);
  useKeyHandler(
    {
      down: (e) => {
        const keyIndex = keys.indexOf(e.key);
        if (keyIndex !== -1) {
          e.preventDefault();
        }
        if (keyIndex !== -1 && !hold.current.find(([key]) => key === e.key)) {
          const press: [string, any] = [e.key, state];
          hold.current = [...hold.current, press];
          down?.(press, keyIndex, hold.current);
        }
      },
      up: (e) => {
        const keyIndex = keys.indexOf(e.key);
        if (keyIndex !== -1) {
          e.preventDefault();
        }
        const pressed = hold.current.find(([key]) => key === e.key);
        if (!!pressed) {
          hold.current = hold.current.filter(([key]) => key !== e.key);
          up?.(pressed, keyIndex, hold.current);
        }
      },
      disabled: mute
    },
    dep
  );
}
