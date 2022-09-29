import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IParetoChartConf } from './type';

export function VizParetoChart({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IParetoChartConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
