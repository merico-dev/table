import { ITemplateVariable } from '~/utils/template';
import { ICartesianChartConf } from '../../type';
import { getReferenceAreas } from './reference_areas';
import { getReferenceLines } from './reference_lines';
import { getSeriesItemOrItems } from './series_items';

export function getSeries(
  conf: ICartesianChartConf,
  xAxisData: $TSFixMe[],
  valueTypedXAxis: boolean,
  data: $TSFixMe[],
  labelFormatters: Record<string, $TSFixMe>,
  variables: ITemplateVariable[],
  variableValueMap: Record<string, string | number>,
) {
  const dataTemplate = xAxisData.map((v) => [v, 0]);
  const ret = conf.series
    .map((c) => getSeriesItemOrItems(conf, c, dataTemplate, valueTypedXAxis, data, variableValueMap, labelFormatters))
    .flat();
  return ret
    .concat(getReferenceLines(conf.reference_lines, variables, variableValueMap, data))
    .concat(getReferenceAreas(conf.reference_areas, variableValueMap));
}
