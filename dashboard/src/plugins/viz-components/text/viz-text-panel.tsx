import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, ITextConf } from './type';

export function VizTextPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<ITextConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
