import { IEchartsLabelPosition } from '~/components/plugins/common-echarts-fields/label-position';
import { getDefaultSeriesUnit, SeriesUnitType } from '../../common-echarts-fields/series-unit';

export interface ISunburstLevelConf {
  id: string;
  r0: string;
  r: string;
  label: {
    show_label_tolerance: number;
    rotate: 'radial' | 'tangential' | '0';
    align: 'left' | 'center' | 'right';
    position: IEchartsLabelPosition;
    padding: number;
  };
}

export interface ISunburstConf {
  label_key: TDataKey;
  value_key: TDataKey;
  group_key: TDataKey;
  unit: SeriesUnitType;
  levels: ISunburstLevelConf[];
}

export const DEFAULT_CONFIG: ISunburstConf = {
  label_key: '',
  value_key: '',
  group_key: '',
  unit: getDefaultSeriesUnit(),
  levels: [],
};

export type SunburstItemType = {
  name: string;
  value?: string | number | null;
} & Record<string, any>;
