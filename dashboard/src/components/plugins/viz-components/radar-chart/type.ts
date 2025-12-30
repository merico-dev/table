import { IEChartsLineType } from '~/components/plugins/common-echarts-fields/line-type';
import { NameColorMapRow } from '~/components/plugins/editor-components/name-color-map-editor';
import { TNumberFormat } from '~/utils';

export type { NameColorMapRow };

export type TRadarSeriesStyle = {
  lineStyle: {
    type: IEChartsLineType;
    width: number;
  };
  areaStyle: {
    opacity: number;
  };
};

export function getDefaultRadarSeriesStyle(): TRadarSeriesStyle {
  return {
    lineStyle: { type: 'solid', width: 1 },
    areaStyle: { opacity: 0.4 },
  };
}

export type TAdditionalSeriesItem = {
  id: string;
  name_key: TDataKey;
  color_key: TDataKey;
  style: TRadarSeriesStyle & { color: string };
};
export interface IRadarChartDimension {
  id: string;
  name: string;
  data_key: TDataKey;
  max: string;
  formatter: TNumberFormat;
}

export interface IRadarChartConf {
  series_name_key: TDataKey;
  color_field: TDataKey;
  color: {
    map: NameColorMapRow[];
  };
  additional_series: TAdditionalSeriesItem[];
  background: {
    enabled: boolean;
  };
  label: {
    enabled: boolean;
  };
  dimensions: IRadarChartDimension[];
  main_series_style: TRadarSeriesStyle;
}

export const DEFAULT_CONFIG: IRadarChartConf = {
  series_name_key: '',
  color_field: '',
  color: {
    map: [],
  },
  additional_series: [],
  background: {
    enabled: true,
  },
  label: {
    enabled: true,
  },
  dimensions: [],
  main_series_style: getDefaultRadarSeriesStyle(),
};
