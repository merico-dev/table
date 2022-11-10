import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { IExpertSystemConf } from './type';

export function VizExpertSystem({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IExpertSystemConf>(context.instanceData, 'config');
  const { width, height } = context.viewport;
  const data = context.data as $TSFixMe[];

  if (!width || !height || !conf) {
    return null;
  }
  return <div>Merico Expert System. URL: {conf.expertSystemURL}</div>;
}
