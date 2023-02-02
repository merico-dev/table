import { dashboardDataSource } from '../data_sources/dashboard';
import Account from '../models/account';
import bcrypt from 'bcrypt';
import { ApiError, BAD_REQUEST, PASSWORD_MISMATCH, INVALID_CREDENTIALS } from '../utils/errors';
import { Account as AccountAPIModel, AccountFilterObject, AccountLoginResponse, AccountPaginationResponse, AccountSortObject } from '../api_models/account';
import { PaginationRequest } from '../api_models/base';
import jwt, { JwtPayload } from 'jsonwebtoken';
import _ from 'lodash';
import logger from 'npmlog';
import { ROLE_TYPES } from '../api_models/role';
import { SALT_ROUNDS, SECRET_KEY, TOKEN_VALIDITY } from '../utils/constants';
import { escapeLikePattern } from '../utils/helpers';
import { ConfigResourceTypes, ConfigService } from './config.service';
import i18n from '../utils/i18n';

export function redactPassword(account: Account) {
  return _.omit(account, 'password');
}

export class AccountService {
  static async getByToken(token: string | undefined): Promise<AccountAPIModel | null> {
    if (!token) {
      return null;
    }
    try {
      const decoded_token = jwt.verify(token, SECRET_KEY as jwt.Secret) as JwtPayload;
      const accountRepo = dashboardDataSource.getRepository(Account);
      const account = await accountRepo.findOneByOrFail({ id: decoded_token.id });
      return redactPassword(account);
    } catch (err) {
      logger.warn(err);
      return null;
    }
  }

  async login(name: string, password: string, locale: string): Promise<AccountLoginResponse> {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const account = await accountRepo.findOne({ where: [{ name }, { email: name }] });
    if (!account) {
      throw new ApiError(INVALID_CREDENTIALS, { message: i18n.__({ phrase: 'Invalid credentials', locale }) });
    }
    if (!(await bcrypt.compare(password, account.password))) {
      throw new ApiError(INVALID_CREDENTIALS, { message: i18n.__({ phrase: 'Invalid credentials', locale }) });
    }
    if (account.role_id <= ROLE_TYPES.INACTIVE) {
      throw new ApiError(INVALID_CREDENTIALS, { message: i18n.__({ phrase: 'Invalid credentials', locale }) });
    }
    const token = jwt.sign({ id: account.id }, SECRET_KEY as jwt.Secret, { expiresIn: TOKEN_VALIDITY });
    return { token, account: redactPassword(account) };
  }

  async list(filter: AccountFilterObject | undefined, sort: AccountSortObject, pagination: PaginationRequest): Promise<AccountPaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager.createQueryBuilder()
      .from(Account, 'account')
      .select('account.id', 'id')
      .addSelect('account.name', 'name')
      .addSelect('account.email', 'email')
      .addSelect('account.role_id', 'role_id')
      .orderBy(sort.field, sort.order)
      .offset(offset).limit(pagination.pagesize);

    if (filter?.search) {
      qb.where('account.name ilike :nameSearch OR account.email ilike :emailSearch', { nameSearch: `%${escapeLikePattern(filter.search)}%`, emailSearch: `%${escapeLikePattern(filter.search)}%` });
    }

    const datasources = await qb.getRawMany<Account>();
    const total = await qb.getCount();
    return {
      total,
      offset,
      data: datasources,
    };
  }

  async create(name: string, email: string | undefined, password: string, role_id: number): Promise<AccountAPIModel> {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const account = new Account();
    account.name = name;
    account.email = email;
    account.role_id = role_id;
    account.password = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await accountRepo.save(account);
    return redactPassword(result);
  }

  async get(id: string): Promise<AccountAPIModel> {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const result = await accountRepo.findOneByOrFail({ id });
    return redactPassword(result);
  }

  async update(id: string, name: string | undefined, email: string | undefined, locale: string): Promise<AccountAPIModel> {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const account = await accountRepo.findOneByOrFail({ id });
    if (account.role_id == ROLE_TYPES.SUPERADMIN) {
      throw new ApiError(BAD_REQUEST, { message: i18n.__({ phrase: 'Can not edit superadmin details', locale }) });
    }
    account.name = name ?? account.name;
    account.email = email === undefined ? account.email : email;
    const result = await accountRepo.save(account);
    return redactPassword(result);
  }

  async edit(id: string, name: string, email: string | undefined, role_id: ROLE_TYPES, reset_password: boolean, new_password: string | undefined, editor_role_id: ROLE_TYPES, locale: string): Promise<AccountAPIModel> {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const account = await accountRepo.findOneByOrFail({ id });
    if (account.role_id >= editor_role_id) {
      throw new ApiError(BAD_REQUEST, { message: i18n.__({ phrase: 'Can not edit account with similar or higher permissions than own account', locale }) });
    }
    if (role_id >= editor_role_id) {
      throw new ApiError(BAD_REQUEST, { message: i18n.__({ phrase: 'Can not change account permissions to similar or higher than own account', locale }) });
    }
    if (reset_password) {
      if (!new_password) {
        throw new ApiError(BAD_REQUEST, { message: i18n.__({ phrase: 'Must provide new_password when reset_password is true', locale }) });
      }
      account.password = await bcrypt.hash(new_password, SALT_ROUNDS);
    }
    account.name = name;
    account.email = email === undefined ? account.email : email;
    account.role_id = role_id;
    const result = await accountRepo.save(account);
    return redactPassword(result);
  }

  async changePassword(id: string, old_password: string, new_password: string): Promise<AccountAPIModel> {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const account = await accountRepo.findOneByOrFail({ id });
    if (!(await bcrypt.compare(old_password, account.password))) {
      throw new ApiError(PASSWORD_MISMATCH);
    }
    account.password = await bcrypt.hash(new_password, SALT_ROUNDS);
    const result = await accountRepo.save(account);
    return redactPassword(result);
  }

  async delete(id: string, role_id: ROLE_TYPES, locale: string): Promise<void> {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const account = await accountRepo.findOneByOrFail({ id });
    if (account.role_id >= role_id) {
      throw new ApiError(BAD_REQUEST, { message: i18n.__({ phrase: 'Can not delete account with similar or higher permissions than own account', locale }) });
    }
    await accountRepo.delete(account.id);
    await ConfigService.delete('lang', ConfigResourceTypes.ACCOUNT, account.id);
  }
}