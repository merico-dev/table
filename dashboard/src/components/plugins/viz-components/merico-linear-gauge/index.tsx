import { VizComponent } from '~/types/plugin';
import { VizMericoLinearGaugeMigrator } from './migrator';
import { VizMericoLinearGauge } from './render/viz-merico-linear-gauge';
import { translation } from './translation';
import { getDefaultConfig, IMericoLinearGaugeConf } from './type';
import { VizMericoLinearGaugeEditor } from './editor';

type ConfigType = {
  version: number;
  config: IMericoLinearGaugeConf;
};

export const VizMericoLinearGaugeVizComponent: VizComponent = {
  displayName: 'viz.merico_linear_gauge.viz_name',
  displayGroup: 'chart.groups.merico_suite',
  migrator: new VizMericoLinearGaugeMigrator(),
  name: 'merico_linear_gauge',
  viewRender: VizMericoLinearGauge,
  configRender: VizMericoLinearGaugeEditor,
  createConfig: (): ConfigType => ({ version: 2, config: getDefaultConfig() }),
  translation,
};
