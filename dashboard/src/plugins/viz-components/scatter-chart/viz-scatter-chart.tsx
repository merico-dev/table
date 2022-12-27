import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IScatterChartConf } from './type';

export function VizScatterChart({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IScatterChartConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
