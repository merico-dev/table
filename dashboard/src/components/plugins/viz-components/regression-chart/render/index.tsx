import { useStorageData } from '~/components/plugins/hooks';
import { VizViewProps } from '~/types/plugin';
import { IRegressionChartConf } from '../type';
import { RenderRegressionChart } from './chart';
import { DefaultVizBox } from '~/styles/viz-box';

export function VizRegressionChart({ context, instance }: VizViewProps) {
  const { value: conf } = useStorageData<IRegressionChartConf>(context.instanceData, 'config');
  const { width, height } = context.viewport;

  if (!width || !height || !conf) {
    return null;
  }
  return (
    <DefaultVizBox width={width} height={height}>
      <RenderRegressionChart context={context} instance={instance} conf={conf} width={width} height={height} />
    </DefaultVizBox>
  );
}
