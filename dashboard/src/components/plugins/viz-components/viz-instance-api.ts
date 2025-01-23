import { VizInstance } from '~/types/plugin';
import { IPanelInfo } from '~/components/plugins';

/**
 * Emit viz rendered event
 * @param instance
 * @param data
 */
export function notifyVizRendered(instance: VizInstance, data: unknown) {
  instance.messageChannels.getChannel('viz').emit('rendered', data);
}

export interface IVizRenderedPayload {
  panel: IPanelInfo;
}

/**
 * Subscribe to viz rendered event of a viz instance
 * @param instance
 * @param callback
 */
export function onVizRendered(instance: VizInstance, callback: (data: unknown) => void) {
  instance.messageChannels.getChannel('viz').on('rendered', callback);
  return () => {
    instance.messageChannels.getChannel('viz').off('rendered', callback);
  };
}
