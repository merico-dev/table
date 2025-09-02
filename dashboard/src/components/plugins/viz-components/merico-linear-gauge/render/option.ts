import _ from 'lodash';
import { IMericoLinearGaugeConf } from '../type';
import { extractData, parseDataKey } from '~/utils';

export const getOption = (conf: IMericoLinearGaugeConf, data: TPanelData) => {
  const ret = {
    value: _.get(extractData(data, conf.value), '0', 'null'),
    sections: conf.sections.map((section) => {
      return {
        name: section.name,
        color: section.color,
        min: !section.minKey ? 0 : _.get(extractData(data, section.minKey), '0', 'null'),
        pointer: false,
        pointer_equal: false,
      };
    }),
  };
  const v = ret.value;
  for (let i = 0; i < ret.sections.length; i++) {
    if (v < ret.sections[i].min) {
      break;
    }
    ret.sections[i].pointer = true;
    ret.sections[i].pointer_equal = v === ret.sections[i].min;
    if (i > 0) {
      ret.sections[i - 1].pointer = false;
      ret.sections[i - 1].pointer_equal = false;
    }
  }
  return ret;
};
