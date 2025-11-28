import { ITemplateVariable } from '~/utils';
import { ICartesianChartConf } from '../../type';
import { IAxisLabels } from '../get-axis-labels';
import { getReferenceAreas } from './reference_areas';
import { getReferenceLines } from './reference_lines';
import { getSeriesItemOrItems } from './series_items';
import { DataTemplateType } from './types';

export function getSeries(
  conf: ICartesianChartConf,
  xAxisLabels: IAxisLabels,
  data: TPanelData,
  labelFormatters: Record<string, $TSFixMe>,
  variables: ITemplateVariable[],
  variableValueMap: Record<string, string | number>,
) {
  const dataTemplate: DataTemplateType[] = xAxisLabels.axisData.map((v) => [v, 0]);
  const ret = conf.series
    .map((c) => getSeriesItemOrItems(conf, c, dataTemplate, data, variableValueMap, labelFormatters, xAxisLabels))
    .flat();
  return ret
    .concat(
      getReferenceLines(
        conf.reference_lines,
        variables,
        variableValueMap,
        data,
        xAxisLabels.axisData,
        conf.x_axis.type,
      ),
    )
    .concat(getReferenceAreas(conf.reference_areas, variableValueMap));
}
