import { IMessageChannels } from '../types/plugin';
import { MessageChannels } from './message-channels';

describe('message channels', () => {
  let channels: IMessageChannels;
  beforeEach(() => {
    channels = new MessageChannels();
  });
  test('can get channel', () => {
    const alice = channels.getChannel('alice');
    const alice2 = channels.getChannel('alice');
    expect(alice).toBe(alice2);
  });
});
