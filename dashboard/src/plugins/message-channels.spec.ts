import { IMessageChannels } from '../types/plugin';
import { MessageChannels } from './message-channels';

describe('message channels', () => {
  let channels:IMessageChannels;
  beforeEach(() => {
    channels = new MessageChannels();
  });
  test('can get channel', () => {
    const alice = channels.getChannel('alice');
    const alice2 = channels.getChannel('alice');
    expect(alice).toBe(alice2);
  });

  test('can close channel', () => {
    const channel = channels.getChannel('foo');
    channels.close('foo');
    const channel2 = channels.getChannel('foo');
    expect(channel).not.toBe(channel2);
  });
});
