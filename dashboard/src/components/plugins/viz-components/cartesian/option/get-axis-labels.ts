import { get, isEmpty, uniq } from 'lodash';
import { parseDataKey } from '../../../../../utils';
import { FormatterFuncType, getEchartsXAxisLabel } from '../../../common-echarts-fields/x-axis-label-formatter';
import { ICartesianChartConf } from '../type';

function buildIdLabelMap(array: object[], idKey: string, labelKey: string) {
  const map = new Map<string, string>();
  for (const item of array) {
    map.set(get(item, idKey), get(item, labelKey));
  }
  return map;
}

export interface IAxisLabels {
  get axisData(): string[];
  get axisKey(): string;
  labelFormatter: FormatterFuncType;
}

class CategoryAxisLabels implements IAxisLabels {
  private idLabelMap: Map<string, string>;
  private idKey: string;
  constructor(
    array: object[],
    idKey: string | undefined | null,
    private labelKey: string,
    private postLabelFormatter?: FormatterFuncType,
  ) {
    if (isEmpty(idKey)) {
      this.idKey = labelKey;
    } else {
      this.idKey = idKey!;
    }
    this.idLabelMap = buildIdLabelMap(array, parseDataKey(this.idKey).columnKey, parseDataKey(labelKey).columnKey);
    this._axisData = Array.from(this.idLabelMap.keys());
  }
  get axisKey(): string {
    return this.idKey;
  }

  private readonly _axisData: string[];

  get axisData() {
    return this._axisData;
  }

  labelFormatter = (value: string | number, index?: number) => {
    const label = this.idLabelMap.get(value as string) || value;
    return this.postLabelFormatter ? this.postLabelFormatter(label, index) : label;
  };
}

class DefaultAxisLabels implements IAxisLabels {
  private readonly _axisData: string[];
  constructor(array: object[], private key: string, private postLabelFormatter?: FormatterFuncType) {
    this._axisData = uniq(array.map((item) => get(item, parseDataKey(key).columnKey)));
  }
  get axisKey(): string {
    return this.key;
  }
  get axisData() {
    return this._axisData;
  }

  labelFormatter = (value: string | number, index?: number) => {
    return this.postLabelFormatter ? this.postLabelFormatter(value, index) : value;
  };
}

export function getAxisLabels(conf: ICartesianChartConf, fullData: object[]): IAxisLabels {
  if (conf.x_axis.type === 'category') {
    return new CategoryAxisLabels(
      fullData,
      conf.x_axis_id_key,
      conf.x_axis_data_key,
      getEchartsXAxisLabel(conf.x_axis.axisLabel.formatter),
    );
  }
  return new DefaultAxisLabels(fullData, conf.x_axis_data_key, getEchartsXAxisLabel(conf.x_axis.axisLabel.formatter));
}
