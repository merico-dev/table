import { AnyObject } from '~/types';
import { ITemplateVariable } from '~/utils/template';
import { ICartesianChartConf } from '../../type';
import { getReferenceAreas } from './reference_areas';
import { getReferenceLines } from './reference_lines';
import { getSeriesItemOrItems } from './series_items';
import { DataTemplateType } from './types';

export function getSeries(
  conf: ICartesianChartConf,
  xAxisData: string[],
  data: TPanelData,
  labelFormatters: Record<string, $TSFixMe>,
  variables: ITemplateVariable[],
  variableValueMap: Record<string, string | number>,
) {
  const dataTemplate: DataTemplateType[] = xAxisData.map((v) => [v, 0]);
  const ret = conf.series
    .map((c) => getSeriesItemOrItems(conf, c, dataTemplate, data, variableValueMap, labelFormatters))
    .flat();
  return ret
    .concat(getReferenceLines(conf.reference_lines, variables, variableValueMap, data))
    .concat(getReferenceAreas(conf.reference_areas, variableValueMap));
}
