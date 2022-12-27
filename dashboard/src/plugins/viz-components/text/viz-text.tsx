import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, ITextConf } from './type';

export function VizText({ context }: VizViewProps) {
  const { value: conf } = useStorageData<ITextConf>(context.instanceData, 'config');
  return <div>Hello World</div>;
}
