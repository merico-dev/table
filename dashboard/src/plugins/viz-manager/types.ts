import { IDashboardPanel } from '../../types';
import {
  IMessageChannels,
  PluginStorage,
  VizComponent,
  VizInstance
} from '../../types/plugin';

export type IPanelInfo = Omit<IDashboardPanel, 'layout'>;

export interface IVizManager {
  readonly availableVizList: VizComponent[];

  resolveComponent(type: string): VizComponent;

  getOrCreateInstance(panel: IPanelInfo): VizInstanceInfo;
}

export interface VizInstanceInfo extends VizInstance {
  messageChannels: IMessageChannels;
  instanceData: PluginStorage;
}
