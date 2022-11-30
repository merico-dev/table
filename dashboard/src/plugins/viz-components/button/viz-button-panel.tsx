import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IButtonConf } from './type';

export function VizButtonPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IButtonConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
