import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IHeatmapConf } from './type';

export function VizHeatmapPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IHeatmapConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
