import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IMericoEstimationChartConf } from './type';

export function VizMericoEstimationChart({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IMericoEstimationChartConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
