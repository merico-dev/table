import { AnyObject } from '~/types';
import { ITemplateVariable } from '~/utils/template';
import { IHorizontalBarChartConf } from '../../type';
import { getReferenceLines } from './reference_lines';
import { getSeriesItemOrItems } from './series_items';
import { DataTemplateType } from './types';

export function getSeries(
  conf: IHorizontalBarChartConf,
  xAxisData: string[],
  valueTypedXAxis: boolean,
  data: AnyObject[],
  labelFormatters: Record<string, $TSFixMe>,
  variables: ITemplateVariable[],
  variableValueMap: Record<string, string | number>,
) {
  const dataTemplate: DataTemplateType[] = xAxisData.map((v) => [v, 0]);
  const ret = conf.series
    .map((c) => getSeriesItemOrItems(conf, c, dataTemplate, valueTypedXAxis, data, variableValueMap, labelFormatters))
    .flat();
  return ret.concat(getReferenceLines(conf.reference_lines, variables, variableValueMap, data));
}
