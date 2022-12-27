import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IScatterChartConf } from './type';

export function VizScatterChartPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IScatterChartConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
