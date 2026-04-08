import { useEffect } from 'react';

export const useKeyboardShortcuts = (
  popupOpen: boolean,
  apiUrlPopupOpen: boolean,
  setPopupOpen: (open: boolean) => void,
  setApiUrlPopupOpen: (open: boolean) => void
) => {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setPopupOpen(false);
        setApiUrlPopupOpen(false);
      }
    }

    if (popupOpen || apiUrlPopupOpen) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [popupOpen, apiUrlPopupOpen, setPopupOpen, setApiUrlPopupOpen]);
};
