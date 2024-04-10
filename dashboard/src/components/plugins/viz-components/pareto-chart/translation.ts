import { TranslationPatch } from '~/types/plugin';

const en = {
  pareto_chart: {
    viz_name: 'Pareto Chart',
    line_80_20: {
      label: '80-20 Line',
      label_template: 'Label Template',
      click_to_see_params: 'Click to see params for Label Template',
      param_section_note_1: '80-20 line stuff',
      param_section_note_2: 'chart configs',
    },
    click_series: {
      label: 'Click chart series',
    },
  },
};

const zh = {
  pareto_chart: {
    viz_name: '帕累托图',
    line_80_20: {
      label: '80/20线',
      label_template: '线上文案模板',
      click_to_see_params: '点击查看线上文案模板的参数',
      param_section_note_1: '80-20线相关',
      param_section_note_2: '图表配置信息',
    },
    click_series: {
      label: '点击柱或线',
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
