import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IHeatmapConf } from './type';

export function VizHeatmap({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IHeatmapConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
