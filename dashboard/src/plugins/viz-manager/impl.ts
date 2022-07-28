import { IPluginManager, VizComponent } from '../../types/plugin';
import { JsonPluginStorage } from '../json-plugin-storage';
import { MessageChannels } from '../message-channels';
import { IPanelInfo, IVizManager, VizInstanceInfo } from './types';

export class VizManager implements IVizManager {
  private instances: Map<string, VizInstanceInfo> = new Map<string, VizInstanceInfo>();

  constructor(private pluginManager: IPluginManager) {
  }

  get availableVizList(): VizComponent[] {
    return this.pluginManager.installedPlugins.flatMap(it => it.manifest.viz);
  }

  resolveComponent(name: string) {
    return this.pluginManager.factory.viz(name);
  }

  getOrCreateInstance(panel: IPanelInfo) {
    const result = this.instances.get(panel.id);
    if (result) {
      return result;
    }
    const instanceInfo: VizInstanceInfo = {
      id: panel.id,
      name: panel.viz.type,
      messageChannels: new MessageChannels(),
      instanceData: new JsonPluginStorage(panel.viz.conf)
    };
    this.instances.set(panel.id, instanceInfo);
    return instanceInfo;
  }
}
