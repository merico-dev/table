import { TranslationPatch } from '~/types/plugin';

const en = {
  vizLinearGauge: {
    viz_name: 'VizLinearGauge',
  },
};

const zh = {
  vizLinearGauge: {
    viz_name: 'VizLinearGauge',
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
