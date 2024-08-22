import { useEffect, useRef } from "react";

export const useClickOutside = (handler: () => void) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | null) => {
      if (ref.current && !ref.current.contains(event?.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handler]);

  return ref;
};
