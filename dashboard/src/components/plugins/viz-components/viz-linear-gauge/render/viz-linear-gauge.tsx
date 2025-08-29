import { VizViewProps } from '~/types/plugin';
import { useStorageData } from '~/components/plugins';
import { DEFAULT_CONFIG, IVizLinearGaugeConf } from '../type';

export function VizLinearGauge({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IVizLinearGaugeConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
