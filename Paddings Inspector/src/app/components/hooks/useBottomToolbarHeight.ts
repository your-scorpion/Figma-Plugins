import { useState, useLayoutEffect, RefObject } from 'react';

export const useBottomToolbarHeight = (
  toolbarRef: RefObject<HTMLDivElement>
): number => {
  const [height, setHeight] = useState<number>(32);

  useLayoutEffect(() => {
    const el = toolbarRef.current;
    if (!el) return;

    const update = () => setHeight(el.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, [toolbarRef]);

  return height;
};
