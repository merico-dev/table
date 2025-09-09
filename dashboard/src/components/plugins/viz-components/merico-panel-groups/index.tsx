import { VizComponent } from '~/types/plugin';
import { VizMericoPanelGroupsMigrator } from './migrator';
import { VizMericoPanelGroups } from './render/viz-merico-panel-groups';
import { translation } from './translation';
import { getDefaultConfig, VizMericoPanelGroupsConf } from './type';
import { VizMericoPanelGroupsEditor } from './editor';

type ConfigType = {
  version: number;
  config: VizMericoPanelGroupsConf;
};

export const VizMericoPanelGroupsVizComponent: VizComponent = {
  displayName: 'viz.merico_panel_groups.viz_name',
  displayGroup: 'chart.groups.merico_suite',
  migrator: new VizMericoPanelGroupsMigrator(),
  name: 'merico_panel_groups',
  viewRender: VizMericoPanelGroups,
  configRender: VizMericoPanelGroupsEditor,
  createConfig: (): ConfigType => ({ version: 1, config: getDefaultConfig() }),
  translation,
};
