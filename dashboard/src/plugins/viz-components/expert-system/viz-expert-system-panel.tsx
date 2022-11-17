import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IExpertSystemConf } from './type';

export function VizExpertSystemPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IExpertSystemConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
