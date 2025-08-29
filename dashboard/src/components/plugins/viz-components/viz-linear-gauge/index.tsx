import { VizComponent } from '~/types/plugin';
import { VizLinearGaugeEditor } from './editor';
import { VizLinearGaugeMigrator } from './migrator';
import { VizLinearGauge } from './render';
import { translation } from './translation';
import { getDefaultConfig, IVizLinearGaugeConf } from './type';

type ConfigType = {
  version: number;
  config: IVizLinearGaugeConf;
};

export const VizLinearGaugeVizComponent: VizComponent = {
  displayName: 'viz.vizLinearGauge.viz_name',
  displayGroup: 'chart.groups.echarts_based_charts',
  migrator: new VizLinearGaugeMigrator(),
  name: 'linear_gauge',
  viewRender: VizLinearGauge,
  configRender: VizLinearGaugeEditor,
  createConfig: (): ConfigType => ({ version: 1, config: getDefaultConfig() }),
  translation,
};
