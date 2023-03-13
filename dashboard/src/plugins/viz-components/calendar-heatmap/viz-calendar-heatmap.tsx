import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, ICalendarHeatmapConf } from './type';

export function VizCalendarHeatmap({ context }: VizViewProps) {
  const { value: conf } = useStorageData<ICalendarHeatmapConf>(context.instanceData, 'config');
  return <div>Calendar Heatmap</div>;
}
