import { createContext } from 'react';
import { Blue, Green, Orange, Red, RedGreen, YellowBlue } from '~/components/plugins/colors';
import { InstanceMigrator } from '~/components/plugins/instance-migrator';
import { PanelAddonManager } from '~/components/plugins/panel-addon';
import { token } from '~/components/plugins/service/service-locator';

import { PanelModelInstance } from '~/dashboard-editor/model/panels';
import {
  IDashboardPlugin,
  IPluginManager,
  ISingleColor,
  IVizInteractionManager,
  IVizOperationManager,
  IVizTriggerManager,
  VizInstance,
} from '~/types/plugin';
import * as PACKAGE from '../../../package.json';
import { ColorManager, IColorManager } from './color-manager';
import { PluginManager } from './plugin-manager';
import { Bar3dChartVizComponent } from './viz-components/bar-3d-chart';
import { BoxplotChartVizComponent } from './viz-components/boxplot-chart';
import { ButtonVizComponent } from './viz-components/button';
import { CalendarHeatmapVizComponent } from './viz-components/calendar-heatmap';
import { CartesianVizComponent } from './viz-components/cartesian';
import { FunnelVizComponent } from './viz-components/funnel';
import { HeatmapVizComponent } from './viz-components/heatmap';
import { HorizontalBarChartVizComponent } from './viz-components/horizontal-bar-chart';
import { MericoEstimationChartVizComponent } from './viz-components/merico-estimation-chart';
import { MericoHeatmapVizComponent } from './viz-components/merico-heatmap';
import { VizMericoLinearGaugeVizComponent } from './viz-components/merico-linear-gauge';
import { MericoStatsVizComponent } from './viz-components/merico-stats';
import { ParetoChartVizComponent } from './viz-components/pareto-chart';
import { PieChartVizComponent } from './viz-components/pie-chart';
import { RadarChartVizComponent } from './viz-components/radar-chart';
import { RegressionChartVizComponent } from './viz-components/regression-chart';
import { RichTextVizComponent } from './viz-components/rich-text';
import { ScatterChartVizComponent } from './viz-components/scatter-chart';
import { StatsVizComponent } from './viz-components/stats';
import { SunburstVizComponent } from './viz-components/sunburst';
import { TableVizComponent } from './viz-components/table';
import { TextVizComponent } from './viz-components/text';
import { VizDashboardStateVizComponent } from './viz-components/viz-dashboard-state';
import { MericoGQMVizComponent } from './viz-components/viz-merico-gqm';
import { VizManager } from './viz-manager';

export interface IPluginContextProps {
  pluginManager: IPluginManager;
  vizManager: VizManager;
  colorManager: IColorManager;
  panelAddonManager: PanelAddonManager;
}

const basicColors = [
  {
    value: '#25262B',
    name: 'Dark',
  },
  {
    value: '#868E96',
    name: 'Gray',
  },
  {
    value: '#FA5252',
    name: 'Red',
  },
  {
    value: '#E64980',
    name: 'Pink',
  },
  {
    value: '#BE4BDB',
    name: 'Grape',
  },
  {
    value: '#7950F2',
    name: 'Violet',
  },
  {
    value: '#4C6EF5',
    name: 'Indigo',
  },
  {
    value: '#228BE6',
    name: 'Blue',
  },
  {
    value: '#15AABF',
    name: 'Cyan',
  },
  {
    value: '#12B886',
    name: 'Teal',
  },
  {
    value: '#40C057',
    name: 'Green',
  },
  {
    value: '#82C91E',
    name: 'Lime',
  },
  {
    value: '#FAB005',
    name: 'Yellow',
  },
  {
    value: '#FD7E14',
    name: 'Orange',
  },
].map(
  (it): ISingleColor => ({
    name: it.name,
    value: it.value,
    type: 'single',
    category: 'basic',
  }),
);

const colorInterpolations = [RedGreen, YellowBlue, Blue, Green, Red, Orange];

export const vizList = [
  TableVizComponent,
  StatsVizComponent,
  TextVizComponent,
  RichTextVizComponent,
  SunburstVizComponent,
  PieChartVizComponent,
  HorizontalBarChartVizComponent,
  Bar3dChartVizComponent,
  BoxplotChartVizComponent,
  FunnelVizComponent,
  HeatmapVizComponent,
  CalendarHeatmapVizComponent,
  ParetoChartVizComponent,
  CartesianVizComponent,
  ScatterChartVizComponent,
  RadarChartVizComponent,
  RegressionChartVizComponent,
  MericoGQMVizComponent,
  MericoEstimationChartVizComponent,
  MericoHeatmapVizComponent,
  MericoStatsVizComponent,
  VizMericoLinearGaugeVizComponent,
  ButtonVizComponent,
  VizDashboardStateVizComponent,
];
export type VizNameKeys = {
  displayName: string;
  displayGroup: string;
};
export const vizNameToKeys = vizList.reduce((ret, curr) => {
  ret[curr.name] = {
    displayName: curr.displayName!,
    displayGroup: curr.displayGroup!,
  };
  return ret;
}, {} as Record<string, VizNameKeys>);

const BuiltInPlugin: () => IDashboardPlugin = () => ({
  id: 'dashboard',
  version: PACKAGE.version,
  manifest: {
    viz: vizList,
    color: [...basicColors, ...colorInterpolations],
  },
});

export const pluginManager = new PluginManager();

/**
 * All available tokens of services, it also serves as an overview of the
 * plugin system
 */
export const tokens = {
  pluginManager: token<IPluginManager>('pluginManager'),
  vizManager: token<VizManager>('vizManager'),
  colorManager: token<IColorManager>('colorManager'),
  panelAddonManager: token<PanelAddonManager>('panelAddonManager'),
  instanceScope: {
    panelModel: token<PanelModelInstance>('panelModel'),
    vizInstance: token<VizInstance>('vizInstance'),
    interactionManager: token<IVizInteractionManager>('interactionManager'),
    migrator: token<InstanceMigrator>('migrator'),
    operationManager: token<IVizOperationManager>('operationManager'),
    triggerManager: token<IVizTriggerManager>('triggerManager'),
  },
};

export const createPluginContext = (): IPluginContextProps => {
  try {
    // reinstall built-in plugin on HMR
    pluginManager.install(BuiltInPlugin());
  } catch (e) {
    // ignore
  }
  const vizManager = new VizManager(pluginManager);
  const colorManager = new ColorManager(pluginManager);
  const panelAddonManager = new PanelAddonManager(pluginManager);
  return { pluginManager, vizManager, colorManager, panelAddonManager };
};

export const PluginContext = createContext<IPluginContextProps>(createPluginContext());

try {
  pluginManager.install(BuiltInPlugin());
} catch (e) {
  // ignore
}
