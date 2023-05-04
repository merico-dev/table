import { IMericoEstimationChartConf } from '../type';

function fibonacci(n: number): number {
  if (n == 1 || n == 2) {
    return 1;
  }
  return fibonacci(n - 2) + fibonacci(n - 1);
}
const levels = Array.from(new Array(10), (_, i) => fibonacci(i + 1));

function getLevel(v: number) {
  if (!v) {
    return 0;
  }
  return levels.findIndex((l) => v <= l) - 1;
}

export function getDataWithLevelInfo(conf: IMericoEstimationChartConf, rawData: TVizData) {
  const { estimated_value, actual_value } = conf.y_axis.data_keys;
  return rawData.map((d) => {
    const estimated_level = getLevel(d[estimated_value]);
    const actual_level = getLevel(d[actual_value]);
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
