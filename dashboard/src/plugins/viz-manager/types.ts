import { IDashboardPanel } from '~/types';
import { VizComponent, VizInstance } from '~/types/plugin';

export type IPanelInfo = Omit<IDashboardPanel, 'layout'>;

export interface IVizManager {
  readonly availableVizList: VizComponent[];

  resolveComponent(type: string): VizComponent;

  getOrCreateInstance(panel: IPanelInfo): VizInstance;
}
