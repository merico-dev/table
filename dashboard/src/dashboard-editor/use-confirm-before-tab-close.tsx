import { useCallback, useEffect } from 'react';

export const useConfirmBeforeTabClose = (hasChanges: boolean) => {
  const handler = useCallback((event: WindowEventMap['beforeunload']) => {
    const e = event || window.event;
    e.preventDefault();
    if (e) {
      e.returnValue = '';
    }
    return '';
  }, []);

  useEffect(() => {
    if (!hasChanges) {
      return;
    }

    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, [hasChanges]);
};
