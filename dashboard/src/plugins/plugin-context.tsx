import { createContext } from 'react';
import * as PACKAGE from '../../package.json';

import { IDashboardPlugin, IPluginManager, ISingleColor } from '../types/plugin';
import { IColorManager, ColorManager } from './color-manager';
import { PluginManager } from './plugin-manager';
import { VizManager } from './viz-manager';
import { RichTextVizComponent } from './viz-components/rich-text';
import { StatsVizComponent } from './viz-components/stats';
import { TableVizComponent } from './viz-components/table';
import { SunburstVizComponent } from './viz-components/sunburst';
import { PieChartVizComponent } from './viz-components/pie-chart';
import { Bar3dChartVizComponent } from './viz-components/bar-3d-chart';
import { BoxplotChartVizComponent } from './viz-components/boxplot-chart';
import { CartesianVizComponent } from './viz-components/cartesian';

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
      CartesianVizComponent,
    ],
    color: [...basicColors],
  },
};

export const pluginManager = new PluginManager();

export const createPluginContext = (): IPluginContextProps => {
  const vizManager = new VizManager(pluginManager);
  const colorManager = new ColorManager(pluginManager);
  return { pluginManager, vizManager, colorManager };
};

export const PluginContext = createContext<IPluginContextProps>(createPluginContext());

pluginManager.install(BuiltInPlugin);
