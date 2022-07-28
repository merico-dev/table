import EventEmitter2 from 'eventemitter2';
import { IMessageChannels } from '../types/plugin';

export class MessageChannels implements IMessageChannels {
  private channels = new Map<string, EventEmitter2 | undefined>();
  globalChannel = new EventEmitter2();

  getChannel(name: string): EventEmitter2 {
    const result = this.channels.get(name);
    if (result) {
      return result;
    }
    const channel = new EventEmitter2();
    this.channels.set(name, channel);
    return channel;
  }

  close(name: string): void {
    const channel = this.channels.get(name);
    if (channel) {
      this.channels.set(name, undefined);
    }
  }

}
