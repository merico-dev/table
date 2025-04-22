import { cloneDeep } from 'lodash';
import { VizComponent } from '~/types/plugin';
import { VizScatterChartMigrator } from './migrators';
import { translation } from './translation';
import { ClickScatterChartSeries } from './triggers';
import { DEFAULT_CONFIG, IScatterChartConf } from './type';
import { VizScatterChart } from './viz-scatter-chart';
import { VizScatterChartEditor } from './viz-scatter-chart-editor';

export const ScatterChartVizComponent: VizComponent = {
  displayName: 'viz.scatter_chart.viz_name',
  displayGroup: 'chart.groups.echarts_based_charts',
  migrator: new VizScatterChartMigrator(),
  name: 'scatterChart',
  viewRender: VizScatterChart,
  configRender: VizScatterChartEditor,
  createConfig() {
    return {
      version: 13,
      config: cloneDeep(DEFAULT_CONFIG) as IScatterChartConf,
    };
  },
  triggers: [ClickScatterChartSeries],
  translation,
};
