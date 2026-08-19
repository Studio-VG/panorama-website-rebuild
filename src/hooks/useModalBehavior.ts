import { useEffect } from 'react';

/**
 * Closes the caller's modal on Escape and locks background scroll while
 * it's open. Pass `active=false` (or omit rendering the modal at all) when
 * there's nothing to close - the effect no-ops and restores scroll.
 */
export function useModalBehavior(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [active, onClose]);
}
