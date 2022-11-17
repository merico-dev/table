import { useModelContext } from '~/contexts';
import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IExpertSystemConf } from './type';

export function VizExpertSystem({ context }: VizViewProps) {
  const model = useModelContext();
  const { value: conf } = useStorageData<IExpertSystemConf>(context.instanceData, 'config');
  return <div>Merico Expert System. URL: {model.config.MERICO_EXPERT_SYSTEM_URL}</div>;
}
