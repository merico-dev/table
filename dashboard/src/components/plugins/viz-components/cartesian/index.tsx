import { cloneDeep } from 'lodash';
import { VizComponent } from '~/types/plugin';
import { VizCartesianMigrator } from './migrators';
import { translation } from './translation';
import { ClickEchartSeries } from './triggers/click-echart';
import { DEFAULT_CONFIG, ICartesianChartConf } from './type';
import { VizCartesianChart } from './viz-cartesian-chart';
import { VizCartesianEditor } from './viz-cartesian-editor';

export const CartesianVizComponent: VizComponent = {
  displayName: 'viz.cartesian_chart.viz_name',
  displayGroup: 'chart.groups.echarts_based_charts',
  migrator: new VizCartesianMigrator(),
  name: 'cartesian',
  viewRender: VizCartesianChart,
  configRender: VizCartesianEditor,
  createConfig() {
    return {
      version: 24,
      config: cloneDeep(DEFAULT_CONFIG) as ICartesianChartConf,
    };
  },
  triggers: [ClickEchartSeries],
  translation,
};
