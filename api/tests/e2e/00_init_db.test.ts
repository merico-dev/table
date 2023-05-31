import { connectionHook } from './jest.util';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { RoleService } from '~/services/role.service';

describe('System Init', () => {
  connectionHook();

  it('migrate', async () => {
    await dashboardDataSource.runMigrations({ transaction: 'none' });
    await RoleService.ensureFixedRolePermissions();
  }, 120000);
});
