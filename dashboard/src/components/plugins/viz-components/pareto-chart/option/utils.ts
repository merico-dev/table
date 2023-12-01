import { formatNumber } from '~/utils';
import { IParetoChartConf } from '../type';

export function formatPercentage(value: number) {
  return formatNumber(value, {
    output: 'percent',
    mantissa: 0,
    absolute: false,
  });
}

function formatterForLine(payload: $TSFixMe) {
  const value = payload.value[1];
  try {
    return formatPercentage(value);
  } catch (error) {
    console.error(error);
    return value;
  }
}

export type TParetoFormatters = {
  bar: (payload: $TSFixMe) => void;
  line: (payload: $TSFixMe) => void;
  lineValue: typeof formatPercentage;
};

export function getFormatters(conf: IParetoChartConf): TParetoFormatters {
  function formatterForBar(payload: $TSFixMe) {
    let value = payload;
    if (typeof payload === 'object') {
      if (Array.isArray(payload.value) && payload.value.length === 2) {
        // when there's grouped entries in one seriesItem (use 'Group By' field in editor)
        value = payload.value[1];
      } else {
        value = payload.value;
      }
    }
    if (!conf.bar.label_formatter) {
      return value;
    }
    try {
      return formatNumber(value, conf.bar.label_formatter);
    } catch (error) {
      console.error(error);
      return value;
    }
  }

  return {
    bar: formatterForBar,
    line: formatterForLine,
    lineValue: formatPercentage,
  };
}
