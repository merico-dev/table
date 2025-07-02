import { useState } from 'react';

export const useDataKey = (initialKey: TDataKey) => {
  const [value, set] = useState(initialKey);
  return {
    value,
    set,
  };
};

export type UseDataKeyReturn = ReturnType<typeof useDataKey>;
