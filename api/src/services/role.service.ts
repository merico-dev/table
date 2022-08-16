import Role from '../models/role';
import { dashboardDataSource } from '../data_sources/dashboard';
import { ROLE_TYPES } from '../api_models/role';
import Account from '../models/account';
import { ApiError, FORBIDDEN, UNAUTHORIZED } from '../utils/errors';
import { AUTH_ENABLED } from '../utils/constants';

export class RoleService {
  async list(): Promise<Role[]> {
    const roleRepo = dashboardDataSource.getRepository(Role);
    return await roleRepo.find();
  }

  checkPermission(account: Account | null, minimum_required_role: ROLE_TYPES): void {
    if (!AUTH_ENABLED) {
      return;
    }
    if (!account) {
      throw new ApiError(UNAUTHORIZED, { message: 'User not online' });
    }
    if (account.role_id < minimum_required_role) {
      throw new ApiError(FORBIDDEN, { message: 'Insufficient privileges' });
    }
  }
}