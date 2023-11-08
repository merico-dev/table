import { CustomSeriesRenderItemAPI } from 'echarts';

export const BOX_WIDTH = [10, 40];

export function getLayout(api: CustomSeriesRenderItemAPI) {
  // Leftside for scatter
  // Rightside for box
  return api.barLayout({
    barMinWidth: BOX_WIDTH[0],
    barMaxWidth: BOX_WIDTH[1],
    count: 2,
  });
}
