import { createElement, ReactNode } from 'react';
import { IDashboardPanel } from '../types';
import {
  IMessageChannels,
  IPanelInfoEditor,
  IPluginManager,
  VizComponent, VizConfigContext,
  VizContext, VizViewContext,
} from '../types/plugin';
import { JsonPluginStorage } from './json-plugin-storage';

export interface IVizManager {
  readonly availableVizList: VizComponent[];

  createVizView(panel: IDashboardPanel, data: any): ReactNode;

  createVizConfig(panel: IDashboardPanel, panelInfoEditor: IPanelInfoEditor, data: any): ReactNode;
}

export type IPanelInfo = Omit<IDashboardPanel, 'layout'>;

export class VizManager implements IVizManager {
  constructor(private pluginManager: IPluginManager) {
  }

  createVizConfig(panel: IPanelInfo, panelInfoEditor: IPanelInfoEditor, data: any): ReactNode {
    const comp = this.resolveComponent(panel.viz.type);
    return createElement(comp.configRender, {
      context: {
        ...this.createCommonConfig(panel, data),
        panelInfoEditor: panelInfoEditor
      } as VizConfigContext,
      instance: { id: panel.id, name: comp.name }
    });
  }

  get availableVizList(): VizComponent[] {
    return this.pluginManager.installedPlugins.flatMap(it => it.manifest.viz);
  }

  createVizView(panel: IDashboardPanel, data: any): ReactNode {
    const comp = this.resolveComponent(panel.viz.type);
    return createElement(comp.viewRender, {
      context: {
        ...this.createCommonConfig(panel, data),
        viewport: { width: panel.layout.w, height: panel.layout.h },
      } as VizViewContext,
      instance: { id: panel.id, name: comp.name }
    });
  }

  private resolveComponent(name: string) {
    return this.pluginManager.factory.viz(name);
  }

  private createCommonConfig(panel: IPanelInfo, data: any): VizContext {
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
       * todo: implement plugin scope storage, that is shared
       * between instances
       */
      pluginData: new JsonPluginStorage({}),
      /**
       * todo: color palette not implemented
       */
      colorPalette: {
        getColor() {
          return () => '';
        }
      },
      data
    };
  }
}
