import * as echarts from 'echarts/core';

// from Merico Design Tokens
export const ChartTheme = {
  grid: {
    axis: '#97999D',
    scope: 'rgba(47,140,192,0.1)',
    boundary: '#789AB4',
    reference: '#CFCFD8',
  },
  graphics: {
    compared: {
      blueDark: '#3E7CAB',
      blue: '#6398C7',
      blueLight: '#7CB0DF',
      blue10: '#6398C71a',
      redDark: '#AF5F6B',
      red: '#CD7C88',
      redLight: '#E794A0',
      red10: '#CD7C881a',
    },
    gradient: {
      distributed:
        'linear-gradient(90deg, #1babe6 0%, #2fc8c8 28.63%, #98d44b 48.86%, #ffd057 67.53%, #f5ae53 80.6%, #e76441 91.18%, #b90000 100%)',
      protrude: 'linear-gradient(180deg, #ec73734d 0%, #ec737300 100%)',
    },
    level: {
      lv0: '#6398C7',
      lv1: '#61B5BF',
      lv2: '#54D4BB',
      lv3: '#F5D277',
      lv4: '#E8BB7F',
      lv5: '#DB9E84',
      lv6: '#CB8089',
    },
    depth: {
      dp0: '#FFF7F8',
      dp1: '#FFE1E1',
      dp2: '#FDBCBC',
      dp3: '#F39494',
      dp4: '#FA4242',
      dp5: '#E21212',
    },
    multiple: {
      c1: '#66B4DB',
      c2: '#E46464',
      c3: '#EEBA00',
      c4: '#33A678',
      c5: '#9D88CB',
      c6: '#939943',
      c7: '#E49792',
      c8: '#09A2B8',
      c9: '#AF5F6B',
      c10: '#6CA157',
      c11: '#3E7CAB',
      c12: '#6398C7',
      c13: '#E692BA',
      c14: '#97B566',
      c15: '#8CACE2',
      c16: '#CA79AC',
      c17: '#6DBC80',
      c18: '#B08F4B',
      c19: '#39BFA2',
      c20: '#826BAF',
    },
  },
};

function registerEchartsThemes() {
  echarts.registerTheme('merico-light', {
    color: Object.values(ChartTheme.graphics.multiple),
    visualMap: {
      color: Object.values(ChartTheme.graphics.depth).reverse(),
    },
  });
}

export function registerThemes() {
  registerEchartsThemes();
}
