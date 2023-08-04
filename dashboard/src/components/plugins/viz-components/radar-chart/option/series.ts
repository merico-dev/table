import { AnyObject } from '~/types';
import { IRadarChartConf, IRadarChartDimension } from '../type';
import { parseDataKey } from '~/utils/data';
import { getSeriesLabel } from './series.label';

function getDimensionValues(row: AnyObject, dimensions: IRadarChartDimension[]) {
  return dimensions.map(({ data_key }) => {
    const k = parseDataKey(data_key);
    return row[k.columnKey];
  });
}
function getSeriesData(data: TPanelData, name_key: string, dimensions: IRadarChartDimension[]) {
  const name = parseDataKey(name_key);
  return data[name.queryID].map((row) => {
    return {
      value: getDimensionValues(row, dimensions),
      name: row[name.columnKey],
    };
  });
}

function getMainSeries(data: TPanelData, conf: IRadarChartConf) {
  const { series_name_key, dimensions } = conf;
  const seriesData = getSeriesData(data, series_name_key, dimensions);
  return [
    {
      type: 'radar',
      name: 'main-radar',
      data: seriesData,
      symbolSize: 4,
      lineStyle: {
        width: 1,
      },
      emphasis: {
        lineStyle: {
          width: 4,
        },
      },
      areaStyle: conf.background.enabled
        ? {
            opacity: 0.4,
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
      const seriesData = queryData.map((row) => {
        const n = row[name.columnKey];
        const c = row[color.columnKey];
        return {
          name: n,
          value: getDimensionValues(row, dimensions),
          itemStyle: {
            color: c,
          },
        };
      });
      return {
        type: 'radar',
        colorBy: 'data',
        data: seriesData,
        symbolSize: 4,
        lineStyle: {
          width: 1,
        },
        emphasis: {
          lineStyle: {
            width: 4,
          },
        },
        areaStyle: conf.background.enabled
          ? {
              opacity: 0.4,
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
  console.log(ret);
  return ret;
}
