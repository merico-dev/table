import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IStatusConf } from './type';

export function VizStatus({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IStatusConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
