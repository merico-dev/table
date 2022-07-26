import { createElement, ReactNode } from 'react';
import { IDashboardPanel } from '../types';
import {
  IMessageChannels,
  IPluginManager,
  VizViewContext
} from '../types/plugin';
import { JsonPluginStorage } from './json-plugin-storage';

export interface IVizManager {
  createVizView(panel: IDashboardPanel): ReactNode;

  createVizConfig(panel: IDashboardPanel): ReactNode;
}

export class VizManager implements IVizManager {
  constructor(private pluginManager: IPluginManager) {
  }

  createVizConfig(panel: IDashboardPanel): ReactNode {
    const comp = this.resolveComponent(panel);
    return createElement(comp.configRender, {
      context: this.createConfigContext(panel),
      instance: { id: panel.id, name: comp.name }
    });
  }

  createVizView(panel: IDashboardPanel): ReactNode {
    const comp = this.resolveComponent(panel);
    return createElement(comp.viewRender, {
      context: this.createViewContext(panel),
      instance: { id: panel.id, name: comp.name }
    });
  }

  private resolveComponent(panel: IDashboardPanel) {
    return this.pluginManager.factory.viz(panel.viz.type);
  }

  private createViewContext(panel: IDashboardPanel): VizViewContext {
    return {
      viewport: { width: panel.layout.w, height: panel.layout.h },
      data: [],
      ...this.createConfigContext(panel)
    };
  }

  private createConfigContext(panel: IDashboardPanel) {
    return {
      /**
       * todo: locale not implemented
       */
      locale: 'zh',
      /**
       * todo: implement msgChannel
       */
      msgChannels: null as unknown as IMessageChannels,
      instanceData: new JsonPluginStorage(panel.viz.conf),
      /**
       * todo: implement plugin scope storage, that be shared
       * between instances
       */
      pluginData: new JsonPluginStorage(panel.viz.conf),
      /**
       * todo: color palette not implemented
       */
      colorPalette: {
        getColor() {
          return () => '';
        }
      }
    };
  }
}
