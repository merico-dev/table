import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IRegressionChartConf } from './type';

export function VizRegressionChart({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IRegressionChartConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
