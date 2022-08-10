import { useBoolean } from 'ahooks';
import { useCallback, useEffect, useState } from 'react';
import { PluginStorage } from '../../types/plugin';

export const useStorageData = <T>(storage: PluginStorage, dataKey: string) => {
  const [loading, { setFalse }] = useBoolean(true);
  const [value, setValue] = useState<T>();
  useEffect(() => {
    storage.getItem<T>(dataKey).then((result) => {
      setValue(result);
      setFalse();
    });
  });
  const set = useCallback(
    async (val: T) => {
      await storage.setItem(dataKey, val);
      setValue(val);
    },
    [storage, dataKey],
  );
  return {
    loading,
    value,
    set,
  };
};
