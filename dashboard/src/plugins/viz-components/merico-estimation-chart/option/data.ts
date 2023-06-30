import { parseDataKey } from '~/utils/data';
import { IMericoEstimationChartConf } from '../type';

function fibonacci(n: number): number {
  if (n == 1 || n == 2) {
    return 1;
  }
  return fibonacci(n - 2) + fibonacci(n - 1);
}
const levels = Array.from(new Array(20), (_, i) => fibonacci(i + 1));

function getLevel(v: number) {
  if (v <= 1) {
    return v; // 0, 1
  }
  return levels.findIndex((l) => v <= l) - 1;
}

export function getDataWithLevelInfo(conf: IMericoEstimationChartConf, rawData: TPanelData) {
  const { x_axis, deviation } = conf;
  const x = parseDataKey(x_axis.data_key);
  const e = parseDataKey(deviation.data_keys.estimated_value);
  const a = parseDataKey(deviation.data_keys.actual_value);
  return rawData[x.queryID].map((d) => {
    const estimated_level = getLevel(d[e.columnKey]);
    const actual_level = getLevel(d[a.columnKey]);
    const diff_level = estimated_level - actual_level;
    return {
      ...d,
      level: {
        estimated: estimated_level,
        actual: actual_level,
        diff: diff_level,
      },
    };
  });
}
