import { IPanelInfo } from '~/components/plugins';
import { VizInstance } from '~/types/plugin';

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
  const channel = instance.messageChannels.getChannel('viz');
  channel.on('rendered', callback);
  return () => {
    channel.off('rendered', callback);
  };
}

export function notifyPanelLoaded(instance: VizInstance, data: unknown) {
  instance.messageChannels.getChannel('panel').emit('loaded', data);
}

export function onPanelLoaded(instance: VizInstance, callback: (data: unknown) => void) {
  const channel = instance.messageChannels.getChannel('panel');
  channel.on('loaded', callback);
  return () => {
    channel.off('loaded', callback);
  };
}
