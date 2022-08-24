import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IStatusConf } from './type';

export function VizStatusPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IStatusConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
