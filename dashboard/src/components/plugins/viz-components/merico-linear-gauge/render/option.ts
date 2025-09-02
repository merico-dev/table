import _ from 'lodash';
import { IMericoLinearGaugeConf } from '../type';
import { extractData, parseDataKey } from '~/utils';

export const getOption = (conf: IMericoLinearGaugeConf, data: TPanelData) => {
  return {
    value: _.get(extractData(data, conf.value), '0', 'null'),
    sections: conf.sections.map((section) => {
      return {
        name: section.name,
        color: section.color,
        min: !section.minKey ? 0 : _.get(extractData(data, section.minKey), '0', 'null'),
      };
    }),
  };
};
