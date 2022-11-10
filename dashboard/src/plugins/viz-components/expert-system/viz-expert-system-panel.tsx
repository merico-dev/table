import { TextInput } from '@mantine/core';
import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IExpertSystemConf } from './type';

export function VizExpertSystemPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IExpertSystemConf>(context.instanceData, 'config');
  const setURL = (v: string) => {
    setConf({
      expertSystemURL: v,
    });
  };
  return (
    <TextInput
      value={conf?.expertSystemURL}
      onChange={(e) => {
        setURL(e.currentTarget.value);
      }}
      label="Expert System URL"
      required
    />
  );
}
