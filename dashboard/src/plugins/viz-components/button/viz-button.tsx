import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IButtonConf } from './type';

export function VizButton({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IButtonConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
