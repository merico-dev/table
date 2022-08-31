import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IRegressionChartConf } from './type';

export function VizRegressionChartPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IRegressionChartConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
