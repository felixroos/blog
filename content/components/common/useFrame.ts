import React, { useRef } from "react"

export default function useFrame(callback, autostart = false) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = time => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current
      callback(time, deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }

  function start() {
    requestRef.current = requestAnimationFrame(animate);
  }
  function stop() {
    cancelAnimationFrame(requestRef.current);
    requestRef.current = null;
  }
  function toggle() {
    if (!requestRef.current) {
      start()
    } else {
      stop();
    }
  }

  React.useEffect(() => {
    autostart && start();
    return () => stop()
  }, []); // Make sure the effect runs only once
  return { start, stop, toggle };
}
