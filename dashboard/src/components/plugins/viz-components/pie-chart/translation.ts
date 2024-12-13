import { TranslationPatch } from '~/types/plugin';

const en = {
  pie_chart: {
    viz_name: 'Pie Chart',
    click_series: {
      label: 'Click pie series',
    },
    radius: {
      label: 'Radius',
      inner: 'Inner',
      outer: 'Outer',
    },
    color: {
      map: {
        label: 'Color Map',
        name: 'Record name',
        add_a_row: 'Add a mapping rule',
        use_a_palette: 'Use a palette',
        click_to_apply_palette: 'Click to apply palette',
      },
    },
  },
};

const zh = {
  pie_chart: {
    viz_name: '饼图',
    click_series: {
      label: '点击饼瓣',
    },
    radius: {
      label: '内外半径',
      inner: '内',
      outer: '外',
    },
    color: {
      map: {
        label: '颜色映射表',
        name: '数据名称',
        add_a_row: '增加一条映射规则',
        use_a_palette: '使用预设配色方案',
        click_to_apply_palette: '点击应用配色方案',
      },
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
