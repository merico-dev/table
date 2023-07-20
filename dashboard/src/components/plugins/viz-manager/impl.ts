import { IPluginManager, VizComponent, VizInstance } from '~/types/plugin';
import { JsonPluginStorage } from '../json-plugin-storage';
import { MessageChannels } from '../message-channels';
import { IPanelInfo, IVizManager } from './types';

export class VizManager implements IVizManager {
  private instances: Map<string, VizInstance> = new Map<string, VizInstance>();

  constructor(private pluginManager: IPluginManager) {}

  get availableVizList(): VizComponent[] {
    return this.pluginManager.installedPlugins.flatMap((it) => it.manifest.viz);
  }

  resolveComponent(name: string) {
    return this.pluginManager.factory.viz(name);
  }

  getOrCreateInstance(panel: IPanelInfo) {
    const result = this.instances.get(panel.id);
    if (result) {
      return result;
    }
    const instanceInfo: VizInstance = {
      id: panel.id,
      name: panel.viz.type,
      type: panel.viz.type,
      messageChannels: new MessageChannels(),
      instanceData: new JsonPluginStorage(panel.viz.conf),
    };
    this.instances.set(panel.id, instanceInfo);
    return instanceInfo;
  }
}
