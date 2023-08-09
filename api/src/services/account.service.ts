import { dashboardDataSource } from '../data_sources/dashboard';
import Account from '../models/account';
import bcrypt from 'bcrypt';
import { ApiError, BAD_REQUEST, PASSWORD_MISMATCH, INVALID_CREDENTIALS } from '../utils/errors';
import {
  Account as AccountAPIModel,
  AccountFilterObject,
  AccountLoginResponse,
  AccountPaginationResponse,
  AccountSortObject,
} from '../api_models/account';
import { PaginationRequest } from '../api_models/base';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { FIXED_ROLE_TYPES, PERMISSIONS } from './role.service';
import { SALT_ROUNDS, SECRET_KEY, TOKEN_VALIDITY } from '../utils/constants';
import { applyQueryFilterObjects, omitFields } from '../utils/helpers';
import { ConfigResourceTypes, ConfigService } from './config.service';
import { translate } from '../utils/i18n';
import { JobService } from './job.service';
import { injectable } from 'inversify';
import Role from '../models/role';
import logger from 'npmlog';

@injectable()
export class AccountService {
  private static accountDetailsQuery() {
    return dashboardDataSource.manager
      .createQueryBuilder(Account, 'account')
      .innerJoin(Role, 'role', 'account.role_id = role.id')
      .select('account.*')
      .addSelect('role.permissions', 'permissions');
  }

  static async getByToken(token: string | undefined): Promise<AccountAPIModel | undefined> {
    if (!token) {
      return;
    }
    try {
      const decoded_token = jwt.verify(token, SECRET_KEY as jwt.Secret) as JwtPayload;
      const account = await this.accountDetailsQuery()
        .where('account.id = :id', { id: decoded_token.id })
        .getRawOne<AccountAPIModel & { password: string }>();
      if (!account) {
        return;
      }
      return omitFields(account, ['password']);
    } catch (err) {
      logger.warn(err);
      return;
    }
  }

  private async _checkAccountExists(
    name: string | undefined,
    email: string | undefined,
    account: Account,
    locale: string,
  ) {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const where: { [field: string]: string }[] = [];
    if (name !== undefined && account.name !== name) {
      where.push({ name });
    }
    if (email !== undefined && account.email !== email) {
      where.push({ email });
    }
    if (where.length && (await accountRepo.exist({ where }))) {
      throw new ApiError(BAD_REQUEST, { message: translate('ACCOUNT_NAME_EMAIL_ALREADY_EXISTS', locale) });
    }
  }

  async login(name: string, password: string, locale: string): Promise<AccountLoginResponse> {
    const account = await AccountService.accountDetailsQuery()
      .where('account.name = :name or account.email = :name', { name })
      .getRawOne<AccountAPIModel & { password: string }>();
    if (!account) {
      throw new ApiError(INVALID_CREDENTIALS, { message: translate('ACCOUNT_INVALID_CREDENTIALS', locale) });
    }
    if (!(await bcrypt.compare(password, account.password))) {
      throw new ApiError(INVALID_CREDENTIALS, { message: translate('ACCOUNT_INVALID_CREDENTIALS', locale) });
    }
    if (!account.permissions.includes(PERMISSIONS.ACCOUNT_LOGIN)) {
      throw new ApiError(INVALID_CREDENTIALS, { message: translate('ACCOUNT_INVALID_CREDENTIALS', locale) });
    }
    const token = jwt.sign({ id: account.id }, SECRET_KEY as jwt.Secret, { expiresIn: TOKEN_VALIDITY });
    return { token, account: omitFields(account, ['password']) };
  }

  async list(
    filter: AccountFilterObject | undefined,
    sort: AccountSortObject[],
    pagination: PaginationRequest,
  ): Promise<AccountPaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = AccountService.accountDetailsQuery()
      .where('true')
      .orderBy(sort[0].field, sort[0].order)
      .offset(offset)
      .limit(pagination.pagesize);

    applyQueryFilterObjects(
      qb,
      [
        { property: 'name', type: 'FilterObject' },
        { property: 'email', type: 'FilterObject' },
      ],
      'account',
      filter,
    );

    sort.slice(1).forEach((s) => {
      qb.addOrderBy(s.field, s.order);
    });

    const datasources = await qb.getRawMany<AccountAPIModel & { password: string }>();
    const total = await qb.getCount();
    return {
      total,
      offset,
      data: datasources.map((x) => omitFields(x, ['password'])),
    };
  }

  async create(
    name: string,
    email: string | undefined,
    password: string,
    role_id: string,
    locale: string,
  ): Promise<AccountAPIModel> {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const roleRepo = dashboardDataSource.getRepository(Role);
    const where = [{ name }, { email }];
    if (await accountRepo.exist({ where })) {
      throw new ApiError(BAD_REQUEST, { message: translate('ACCOUNT_NAME_EMAIL_ALREADY_EXISTS', locale) });
    }
    if (!(await roleRepo.exist({ where: { id: role_id } }))) {
      throw new ApiError(BAD_REQUEST, { message: translate('ROLE_NOT_FOUND', locale) });
    }
    const account = new Account();
    account.name = name;
    account.email = email === undefined ? null : email;
    account.role_id = role_id;
    account.password = await bcrypt.hash(password, SALT_ROUNDS);
    const { id } = await accountRepo.save(account);
    const result = await AccountService.accountDetailsQuery()
      .where('account.id = :id', { id })
      .getRawOne<AccountAPIModel & { password: string }>();
    return omitFields(result, ['password']);
  }

  async get(id: string, locale: string): Promise<AccountAPIModel> {
    const result = await AccountService.accountDetailsQuery()
      .where('account.id = :id', { id })
      .getRawOne<AccountAPIModel & { password: string }>();
    if (!result) {
      throw new ApiError(BAD_REQUEST, { message: translate('ACCOUNT_NOT_FOUND', locale) });
    }
    return omitFields(result, ['password']);
  }

  async update(
    id: string,
    name: string | undefined,
    email: string | undefined,
    locale: string,
  ): Promise<AccountAPIModel> {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const account = await accountRepo.findOneByOrFail({ id });
    if (name === undefined && email === undefined) {
      const roleRepo = dashboardDataSource.getRepository(Role);
      const role = await roleRepo.findOneByOrFail({ id: account.role_id });
      return { ...omitFields(account, ['password']), permissions: role.permissions };
    }
    await this._checkAccountExists(name, email, account, locale);
    if (account.role_id === FIXED_ROLE_TYPES.SUPERADMIN) {
      throw new ApiError(BAD_REQUEST, { message: translate('ACCOUNT_NO_EDIT_SUPERADMIN', locale) });
    }
    account.name = name ?? account.name;
    account.email = email === undefined ? account.email : email;
    await accountRepo.save(account);
    const result = await AccountService.accountDetailsQuery()
      .where('account.id = :id', { id })
      .getRawOne<AccountAPIModel & { password: string }>();
    return omitFields(result, ['password']);
  }

  async edit(
    id: string,
    name: string | undefined,
    email: string | undefined,
    role_id: string | undefined,
    reset_password: boolean | undefined,
    new_password: string | undefined,
    locale: string,
  ): Promise<AccountAPIModel> {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const account = await accountRepo.findOneByOrFail({ id });
    if (account.role_id === FIXED_ROLE_TYPES.SUPERADMIN) {
      throw new ApiError(BAD_REQUEST, { message: translate('ACCOUNT_NO_EDIT_SUPERADMIN', locale) });
    }
    if (name === undefined && email === undefined && role_id === undefined && reset_password === undefined) {
      const roleRepo = dashboardDataSource.getRepository(Role);
      const role = await roleRepo.findOneByOrFail({ id: account.role_id });
      return { ...omitFields(account, ['password']), permissions: role.permissions };
    }
    if (role_id && !(await dashboardDataSource.getRepository(Role).exist({ where: { id: role_id } }))) {
      throw new ApiError(BAD_REQUEST, { message: translate('ROLE_NOT_FOUND', locale) });
    }
    await this._checkAccountExists(name, email, account, locale);
    if (reset_password) {
      if (!new_password) {
        throw new ApiError(BAD_REQUEST, { message: translate('ACCOUNT_NO_EMPTY_RESET_PASSWORD', locale) });
      }
      account.password = await bcrypt.hash(new_password, SALT_ROUNDS);
    }
    account.name = name === undefined ? account.name : name;
    account.email = email === undefined ? account.email : email;
    account.role_id = role_id === undefined ? account.role_id : role_id;
    await accountRepo.save(account);
    const result = await AccountService.accountDetailsQuery()
      .where('account.id = :id', { id })
      .getRawOne<AccountAPIModel & { password: string }>();
    return omitFields(result, ['password']);
  }

  async changePassword(
    id: string,
    old_password: string,
    new_password: string,
    locale: string,
  ): Promise<AccountAPIModel> {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const account = await accountRepo.findOneByOrFail({ id });
    if (!(await bcrypt.compare(old_password, account.password))) {
      throw new ApiError(PASSWORD_MISMATCH, {
        message: translate('ACCOUNT_PWD_MISMATCH', locale),
      });
    }
    account.password = await bcrypt.hash(new_password, SALT_ROUNDS);
    await accountRepo.save(account);
    const result = await AccountService.accountDetailsQuery()
      .where('account.id = :id', { id })
      .getRawOne<AccountAPIModel & { password: string }>();
    return omitFields(result, ['password']);
  }

  async delete(id: string, locale: string): Promise<void> {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const account = await accountRepo.findOneByOrFail({ id });
    if (account.role_id === FIXED_ROLE_TYPES.SUPERADMIN) {
      throw new ApiError(BAD_REQUEST, { message: translate('ACCOUNT_NO_DELETE_SUPERADMIN', locale) });
    }
    await accountRepo.delete(account.id);
    await ConfigService.delete('lang', ConfigResourceTypes.ACCOUNT, account.id);
    await JobService.addFixDashboardPermissionJob({ auth_id: id, auth_type: 'ACCOUNT' });
  }
}
