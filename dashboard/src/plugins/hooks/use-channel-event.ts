import { ListenerFn } from 'eventemitter2';
import { useEffect } from 'react';

export function useChannelEvent(channel: EventEmitter2, event: string, listener: ListenerFn) {
  useEffect(() => {
    channel.on(event, listener);
    return () => {
      channel.off(event, listener);
    };
  }, [channel, event, listener]);
}
