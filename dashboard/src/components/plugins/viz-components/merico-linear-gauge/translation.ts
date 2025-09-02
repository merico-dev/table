import { TranslationPatch } from '~/types/plugin';

const en = {
  merico_linear_gauge: {
    viz_name: 'Merico Linear Gauge',
    sections: {
      label: 'Sections',
      min_key: {
        placeholder: 'Min value',
        zero: 'Zero',
      },
      add: 'Add a section',
    },
    value: 'Value',
  },
};

const zh = {
  merico_linear_gauge: {
    viz_name: '思码逸线性仪表盘',
    sections: {
      label: '配置区间',
      min_key: {
        placeholder: '区间最小值',
        zero: '零',
      },
      add: '增加一个区间',
    },
    value: '值',
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
