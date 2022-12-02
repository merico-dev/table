import { seed } from './seed/seed';
import { connectionHook } from './jest.util';

describe('System Init', () => {
  connectionHook();

  it('seed', async () => {
    await seed();
  }, 120000);
});