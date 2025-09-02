import { VizViewProps } from '~/types/plugin';
import { useStorageData } from '~/components/plugins';
import { getDefaultConfig, IVizMericoLinearGaugeConf } from '../type';

export function VizMericoLinearGauge({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IVizMericoLinearGaugeConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
