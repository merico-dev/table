import { DEFAULT_AXIS_LABEL_OVERFLOW, IAxisLabelOverflow } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { IEchartsLabelPosition } from '~/plugins/common-echarts-fields/label-position';

export function getNewSeriesItem(id?: string): IFunnelSeriesItem {
  if (!id) {
    id = Date.now().toString();
  }
  return {
    id,
    name: id,
    level_name_data_key: '',
    level_value_data_key: '',
    min: {
      value: 0,
      use_data_min: true,
      size: '0%',
    },
    max: {
      value: 0,
      use_data_max: true,
      size: '100%',
    },
    gap: 2,
    axisLabel: {
      show: true,
      position: 'inside',
      overflow: DEFAULT_AXIS_LABEL_OVERFLOW,
    },
    sort: 'descending',
    orient: 'vertical',
    funnelAlign: 'center',
  };
}

export interface IFunnelSeriesItem {
  id: string;
  name: string;
  level_name_data_key: string;
  level_value_data_key: string;
  min: {
    value: number;
    use_data_min: boolean;
    size: string;
  };
  max: {
    value: number;
    use_data_max: boolean;
    size: string;
  };
  gap: number;
  axisLabel: {
    show: boolean;
    position: IEchartsLabelPosition;
    overflow: IAxisLabelOverflow;
  };
  sort: 'ascending' | 'descending' | 'none';
  orient: 'horizontal' | 'vertical';
  funnelAlign: 'left' | 'right' | 'center';
}

export interface IFunnelConf {
  series: IFunnelSeriesItem[];
}

export const DEFAULT_CONFIG: IFunnelConf = {
  series: [getNewSeriesItem('Funnel')],
};
