import { connectionHook } from './jest.util';
import { dashboardDataSource } from '~/data_sources/dashboard';

describe('System Init', () => {
  connectionHook();

  it('migrate', async () => {
    await dashboardDataSource.runMigrations({ transaction: 'none' });
  }, 120000);
});
