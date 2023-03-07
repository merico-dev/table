import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IFunnelConf } from './type';

export function VizFunnel({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IFunnelConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
