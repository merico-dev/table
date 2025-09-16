import _ from 'lodash';
import { extractData } from '~/utils';
import { IMericoLinearGaugeConf } from '../type';

export const getOption = (conf: IMericoLinearGaugeConf, data: TPanelData) => {
  const { order } = conf;
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
  if (order === 'asc') {
    for (let i = 0; i < ret.sections.length; i++) {
      const min = ret.sections[i].min;
      if (v < min) {
        break;
      }
      ret.sections[i].pointer = true;
      ret.sections[i].pointer_equal = v === min;
      if (i > 0) {
        ret.sections[i - 1].pointer = false;
        ret.sections[i - 1].pointer_equal = false;
      }
    }
  }

  if (order === 'desc') {
    for (let i = ret.sections.length - 1; i >= 0; i--) {
      const min = ret.sections[i].min;
      ret.sections[i].pointer = true;
      ret.sections[i].pointer_equal = v === min;
      if (i < ret.sections.length - 1) {
        ret.sections[i + 1].pointer = false;
        ret.sections[i + 1].pointer_equal = false;
      }
      if (v <= min) {
        break;
      }
    }
  }
  return ret;
};
