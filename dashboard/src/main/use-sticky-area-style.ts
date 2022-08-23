import React from 'react';
import stickybits from 'stickybits';

export function useStickyAreaStyle() {
  React.useEffect(() => {
    const s = stickybits('.dashboard-sticky-area', {
      useStickyClasses: true,
      parentClass: 'dashboard-sticky-parent',
    });
    return () => {
      s?.cleanup();
    };
  }, []);
}
