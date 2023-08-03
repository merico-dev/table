import { useEffect, useState } from 'react';

export function useTabState(initialTab: string | null) {
  const [tab, setTab] = useState(initialTab);
  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);
  return { tab, setTab };
}
