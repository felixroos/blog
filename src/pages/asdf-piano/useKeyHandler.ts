import { useEffect } from "react";

// TODO: replace with common useKeyHandler

export default function useKeyHandler({ down, up, disabled }, deps: any = []) {
  if (disabled) {
    down = () => {};
    up = () => {};
  }
  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, deps); // Empty array ensures that effect is only run on mount and unmount
}
