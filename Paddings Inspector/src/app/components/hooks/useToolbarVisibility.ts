import { useEffect, useRef } from 'react';
import { SCROLL_DELAY_MS } from '../constants';

export const useToolbarVisibility = (
  setToolbarsVisible: (visible: boolean) => void
) => {
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let isScrolling = false;

    const handleScroll = () => {
      if (!isScrolling) {
        setToolbarsVisible(false);
        isScrolling = true;
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setToolbarsVisible(true);
        isScrolling = false;
      }, SCROLL_DELAY_MS);
    };

    const mainContainer = document.querySelector('[data-main-container]') || document.body;
    mainContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      mainContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [setToolbarsVisible]);

  return scrollTimeoutRef;
};
