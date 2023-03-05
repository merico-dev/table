import _, { defaultsDeep } from 'lodash';
import numbro from 'numbro';
import { ITemplateVariable } from '~/utils/template';
import { IHeatmapConf } from '../type';
import { getGrid } from './grid';
import { getLegend } from './legend';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getXAxis } from './x-axis';
import { getYAxis } from './y-axis';

const defaultOption = {
  tooltip: {
    confine: true,
  },
  grid: {
    containLabel: true,
  },
};

// function getLabelFormatters(conf: IHeatmapConf) {
//   const value = function formatter(payload: $TSFixMe) {
//     let value = payload;
//     if (typeof payload === 'object') {
//       if (Array.isArray(payload.value) && payload.value.length === 2) {
//         // when there's grouped entries in one seriesItem (use 'Group By' field in editor)
//         value = payload.value[1];
//       } else {
//         value = payload.value;
//       }
//     }
//     if (!conf.heat_block.label_formatter) {
//       return value;
//     }
//     try {
//       return numbro(value).format(conf.heat_block.label_formatter);
//     } catch (error) {
//       console.error(error);
//       return value;
//     }
//   };

//   return {
//     heat_block,
//   };
// }

export function getOption(conf: IHeatmapConf, data: $TSFixMe[], variables: ITemplateVariable[]) {
  // const labelFormatters = getLabelFormatters(conf);

  // const variableValueMap = variables.reduce((prev, variable) => {
  //   const value = getAggregatedValue(variable, data);
  //   prev[variable.name] = formatAggregatedValue(variable, value);
  //   return prev;
  // }, {} as Record<string, string | number>);

  const customOptions = {
    xAxis: getXAxis(conf, data),
    yAxis: getYAxis(conf, data),
    series: getSeries(conf, data),
    dataset: [
      {
        source: data,
      },
    ],
    // tooltip: getTooltip(conf, labelFormatters),
    grid: getGrid(conf),
    legend: getLegend(),
    visualMap: {
      min: 0,
      max: 200,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      top: 0,
    },
  };
  return defaultsDeep({}, customOptions, defaultOption);
}
