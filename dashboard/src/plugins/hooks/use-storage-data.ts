import { useBoolean } from 'ahooks';
import { useEffect, useState } from 'react';
import { PluginStorage } from '../../types/plugin';

export const useStorageData = <T, >(storage: PluginStorage, dataKey: string,) => {
  const [loading, { setFalse }] = useBoolean(true);
  const [value, setValue] = useState<T>();
  useEffect(() => {
    storage.getItem<T>(dataKey).then((result) => {
      setValue(result);
      setFalse();
    });
  });
  return {
    loading,
    value
  };
};
