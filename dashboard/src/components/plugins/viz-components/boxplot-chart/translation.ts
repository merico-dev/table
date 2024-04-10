import { TranslationPatch } from '~/types/plugin';

const en = {
  boxplot: {
    viz_name: 'Boxplot Chart',
    box: 'Box',
    outlier: 'Outlier',
    scatter: 'Scatter',
    click_series: {
      label: 'Click box, scatter or outlier',
    },
  },
};

const zh = {
  boxplot: {
    viz_name: '箱线图',
    box: '箱体',
    outlier: '异常点',
    scatter: '散点',
    click_series: {
      label: '点击箱体、散点或异常点',
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
