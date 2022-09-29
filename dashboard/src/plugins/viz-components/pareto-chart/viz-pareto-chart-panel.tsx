import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IParetoChartConf } from './type';

export function VizParetoChartPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IParetoChartConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
