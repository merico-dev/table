import { AnyObject } from '~/types';
import { getDefaultRadarSeriesStyle, IRadarChartConf, IRadarChartDimension, NameColorMapRow } from '../type';
import { getColorFeed, parseDataKey } from '~/utils';
import { getSeriesLabel } from './series.label';

function getDimensionValues(row: AnyObject, dimensions: IRadarChartDimension[]) {
  return dimensions.map(({ data_key }) => {
    const k = parseDataKey(data_key);
    return row[k.columnKey];
  });
}

type NameColorMap = Record<string, string>;

function buildColorMap(colorMapRows: NameColorMapRow[]): NameColorMap {
  return colorMapRows.reduce((acc, curr) => {
    const { name, color } = curr;
    if (!name || !color) {
      return acc;
    }
    acc[name] = color;
    return acc;
  }, {} as NameColorMap);
}

function getColor(
  row: AnyObject,
  colorColumnKey: string,
  colorMap: NameColorMap,
  colorFeed: Generator<string, void, unknown>,
): string {
  if (!colorColumnKey) {
    return colorFeed.next().value as string;
  }
  const colorKeyValue = row[colorColumnKey];
  const mappedColor = colorMap[colorKeyValue];
  if (mappedColor) {
    return mappedColor;
  }
  return colorFeed.next().value as string;
}

function getSeriesData(
  data: TPanelData,
  name_key: string,
  color_key: string,
  dimensions: IRadarChartDimension[],
  colorMap: NameColorMap,
  colorFeed: Generator<string, void, unknown>,
) {
  const name = parseDataKey(name_key);
  const color = parseDataKey(color_key);
  return data[name.queryID].map((row) => {
    const resolvedColor = getColor(row, color.columnKey, colorMap, colorFeed);
    return {
      value: getDimensionValues(row, dimensions),
      name: row[name.columnKey],
      itemStyle: {
        color: resolvedColor,
      },
    };
  });
}

function getMainSeries(data: TPanelData, conf: IRadarChartConf) {
  const { series_name_key, color_field, color, dimensions, main_series_style } = conf;
  const colorMap = buildColorMap(color?.map ?? []);
  const colorFeed = getColorFeed('multiple');
  const seriesData = getSeriesData(data, series_name_key, color_field, dimensions, colorMap, colorFeed);
  const style = main_series_style ?? getDefaultRadarSeriesStyle();
  return [
    {
      type: 'radar',
      name: 'main-radar',
      colorBy: 'data',
      data: seriesData,
      symbolSize: 4,
      lineStyle: {
        type: style.lineStyle.type,
        width: style.lineStyle.width,
      },
      emphasis: {
        lineStyle: {
          width: style.lineStyle.width + 3,
        },
      },
      areaStyle: conf.background.enabled
        ? {
            opacity: style.areaStyle.opacity,
          }
        : undefined,
      label: getSeriesLabel(conf),
    },
  ];
}

function getAdditionalSeries(data: TPanelData, conf: IRadarChartConf) {
  const { additional_series, dimensions } = conf;
  const additionalSeries = additional_series
    .map((s) => {
      const name = parseDataKey(s.name_key);
      const color = parseDataKey(s.color_key);
      const queryData = data[name.queryID];
      const style = s.style ?? getDefaultRadarSeriesStyle();
      const useStyleColor = !!style.color;
      const seriesData = queryData.map((row) => {
        const n = row[name.columnKey];
        const c = row[color.columnKey];
        return {
          name: n,
          value: getDimensionValues(row, dimensions),
          itemStyle: {
            color: useStyleColor ? style.color : c,
          },
        };
      });
      return {
        type: 'radar',
        colorBy: useStyleColor ? 'series' : 'data',
        data: seriesData,
        symbolSize: 4,
        ...(useStyleColor ? { color: style.color } : {}),
        lineStyle: {
          type: style.lineStyle.type,
          width: style.lineStyle.width,
        },
        emphasis: {
          lineStyle: {
            width: style.lineStyle.width + 3,
          },
        },
        areaStyle: conf.background.enabled
          ? {
              opacity: style.areaStyle.opacity,
            }
          : undefined,
        label: getSeriesLabel(conf),
      };
    })
    .flat();
  return additionalSeries;
}

export function getSeries(data: TPanelData, conf: IRadarChartConf) {
  const ret = [...getMainSeries(data, conf), ...getAdditionalSeries(data, conf)];
  return ret;
}
