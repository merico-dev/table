import { TranslationPatch } from '~/types/plugin';

const en = {
  regression_chart: {
    viz_name: 'Regression Chart',
    regression_info: 'Regression Info',
    r_sq: 'R-Sq',
    r_sq_adjusted: 'R-Sq(Adjusted)',
  },
};

const zh = {
  regression_chart: {
    viz_name: '回归分析图',
    regression_info: '回归信息',
    r_sq: 'R方',
    r_sq_adjusted: 'R方（调整）',
  },
};

export const translation: TranslationPatch = [
  {
    lang: 'en',
    resources: en,
  },
  {
    lang: 'zh',
    resources: zh,
  },
];
