import { createContext } from 'react';
import * as PACKAGE from '../../package.json';

import { IDashboardPlugin, IPluginManager } from '../types/plugin';
import { PluginManager } from './plugin-manager';
import { TextComponent } from './text';
import { VizManager } from './viz-manager';

interface IPluginContextProps {
  pluginManager: IPluginManager;
  vizManager: VizManager;
}

const BuiltInPlugin: IDashboardPlugin = {
  id: 'dashboard',
  version: PACKAGE.version,
  manifest: {
    viz: [
      TextComponent
    ],
    color: []
  }
};

export const pluginManager = new PluginManager();

export const createPluginContext = (): IPluginContextProps => {
  const vizManager = new VizManager(pluginManager);
  return { pluginManager, vizManager };
};

export const PluginContext = createContext<IPluginContextProps>(createPluginContext());

pluginManager.install(BuiltInPlugin);
