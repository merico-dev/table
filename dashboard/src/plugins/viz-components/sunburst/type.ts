import { IEchartsLabelPosition } from '~/plugins/common-echarts-fields/label-position';

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
  levels: ISunburstLevelConf[];
}

export const DEFAULT_CONFIG: ISunburstConf = {
  label_key: '',
  value_key: '',
  group_key: '',
  levels: [],
};

export type SunburstItemType = {
  name: string;
  value?: string | number | null;
} & Record<string, any>;
