import { CustomSeriesRenderItemAPI, CustomSeriesRenderItemParams } from 'echarts';
import { IBoxplotChartConf } from '../../../type';
import { getBox } from './box';
import { getOutliers } from './outliers';
import { getScatter } from './scatter';
import { BoxplotDataset, BoxplotSeries, Props } from './type';
import { prepare } from './utils';

// TODO:
// 1. tooltip on scatter
// 2. update on resize
function renderBoxScatterAndOutliers(props: Props, seriesConf: BoxplotSeries) {
  const payload = prepare(props);
  const { boxWidth } = seriesConf;

  // Leftside for scatter
  // Rightside for box
  const layout = payload.api.barLayout({
    barMinWidth: boxWidth[0],
    barMaxWidth: boxWidth[1],
    count: 2,
  });

  // Outliers

  const renderProps = { payload, layout, seriesConf };
  const box = getBox(renderProps);
  const scatter = getScatter(renderProps);
  const outliers = getOutliers(renderProps);
  return {
    type: 'group',
    children: [box, scatter, outliers],
  };
}

export function getCustomBoxplot(boxplotDataset: BoxplotDataset, conf: IBoxplotChartConf) {
  const { color } = conf;
  const series: BoxplotSeries = {
    name: 'Custom Box',
    type: 'custom',
    itemStyle: {
      color,
      borderColor: '#2F8CC0',
      borderWidth: 2,
    },
    emphasis: {
      disabled: true,
    },
    boxWidth: [10, 40],
    datasetIndex: 0,
  };

  series.renderItem = (params: CustomSeriesRenderItemParams, api: CustomSeriesRenderItemAPI) => {
    return renderBoxScatterAndOutliers({ boxplotDataset, params, api }, series);
  };
  return series;
}
