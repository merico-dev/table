import { createContext } from 'react';
import { Blue, Green, Orange, Red, RedGreen, YellowBlue } from '~/plugins/colors';
import { InstanceMigrator } from '~/plugins/instance-migrator';
import { token } from '~/service-locator';

import {
  IDashboardPlugin,
  IPluginManager,
  ISingleColor,
  IVizInteractionManager,
  IVizOperationManager,
  VizInstance,
} from '~/types/plugin';
import * as PACKAGE from '../../package.json';
import { ColorManager, IColorManager } from './color-manager';
import { PluginManager } from './plugin-manager';
import { Bar3dChartVizComponent } from './viz-components/bar-3d-chart';
import { BoxplotChartVizComponent } from './viz-components/boxplot-chart';
import { CartesianVizComponent } from './viz-components/cartesian';
import { ParetoChartVizComponent } from './viz-components/pareto-chart';
import { PieChartVizComponent } from './viz-components/pie-chart';
import { RadarChartVizComponent } from './viz-components/radar-chart';
import { RegressionChartVizComponent } from './viz-components/regression-chart';
import { RichTextVizComponent } from './viz-components/rich-text';
import { StatsVizComponent } from './viz-components/stats';
import { SunburstVizComponent } from './viz-components/sunburst';
import { TableVizComponent } from './viz-components/table';
import { VizManager } from './viz-manager';

interface IPluginContextProps {
  pluginManager: IPluginManager;
  vizManager: VizManager;
  colorManager: IColorManager;
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

const BuiltInPlugin: IDashboardPlugin = {
  id: 'dashboard',
  version: PACKAGE.version,
  manifest: {
    viz: [
      TableVizComponent,
      StatsVizComponent,
      RichTextVizComponent,
      SunburstVizComponent,
      PieChartVizComponent,
      Bar3dChartVizComponent,
      BoxplotChartVizComponent,
      ParetoChartVizComponent,
      CartesianVizComponent,
      RadarChartVizComponent,
      RegressionChartVizComponent,
    ],
    color: [...basicColors, ...colorInterpolations],
  },
};

export const pluginManager = new PluginManager();

/**
 * All available tokens of services, it also serves as an overview of the
 * plugin system
 */
export const tokens = {
  pluginManager: token<IPluginManager>('pluginManager'),
  vizManager: token<VizManager>('vizManager'),
  colorManager: token<IColorManager>('colorManager'),
  instanceScope: {
    vizInstance: token<VizInstance>('vizInstance'),
    interactionManager: token<IVizInteractionManager>('interactionManager'),
    migrator: token<InstanceMigrator>('migrator'),
    operationManager: token<IVizOperationManager>('operationManager'),
  },
};

export const createPluginContext = (): IPluginContextProps => {
  try {
    // reinstall built-in plugin on HMR
    pluginManager.install(BuiltInPlugin);
  } catch (e) {
    // ignore
  }
  const vizManager = new VizManager(pluginManager);
  const colorManager = new ColorManager(pluginManager);
  return { pluginManager, vizManager, colorManager };
};

export const PluginContext = createContext<IPluginContextProps>(createPluginContext());

try {
  pluginManager.install(BuiltInPlugin);
} catch (e) {
  // ignore
}
