import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IHorizontalBarChartConf } from './type';

export function VizHorizontalBarChart({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IHorizontalBarChartConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
