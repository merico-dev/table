import { TranslationPatch } from '~/types/plugin';

const en = {
  merico_linear_gauge: {
    viz_name: 'Merico Linear Gauge',
    sections: {
      label: 'Sections',
      min_key: {
        placeholder: 'Min value',
        zero: 'Zero',
        infinity: 'Infinity',
        negative_infinity: 'Negative Infinity',
      },
      add: 'Add a section',
    },
    value: 'Value',
    order: {
      label: 'Order',
      asc: 'Ascending',
      desc: 'Descending',
    },
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
        infinity: '正无穷',
        negative_infinity: '负无穷',
      },
      add: '增加一个区间',
    },
    value: '值',
    order: {
      label: '顺序',
      asc: '升序',
      desc: '降序',
    },
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
