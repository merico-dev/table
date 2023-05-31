import { seed } from './seed/seed';
import { connectionHook } from './jest.util';
import { RoleService } from '~/services/role.service';

describe('System Init', () => {
  connectionHook();

  it('seed', async () => {
    await seed();
    await RoleService.ensureFixedRolePermissions();
  }, 120000);
});
