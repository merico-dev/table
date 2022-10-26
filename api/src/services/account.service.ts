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

export const SALT_ROUNDS = 12;
const SECRET_KEY: jwt.Secret = process.env.SECRET_KEY as jwt.Secret;
const TOKEN_VALIDITY = 7 * 24 * 3600;

export function redactPassword(account: Account) {
  return _.omit(account, 'password');
}

export class AccountService {
  static async getByToken(token: string | undefined): Promise<AccountAPIModel | null> {
    if (!token) {
      return null;
    }
    try {
      const decoded_token = jwt.verify(token, SECRET_KEY) as JwtPayload;
      const accountRepo = dashboardDataSource.getRepository(Account);
      const account = await accountRepo.findOneByOrFail({ id: decoded_token.id });
      return redactPassword(account);
    } catch (err) {
      logger.warn(err);
      return null;
    }
  }

  async login(name: string, password: string): Promise<AccountLoginResponse> {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const account = await accountRepo.findOne({ where: [{ name }, { email: name }] });
    if (!account) {
      throw new ApiError(INVALID_CREDENTIALS, { message: 'Invalid credentials' });
    }
    if (!(await bcrypt.compare(password, account.password))) {
      throw new ApiError(INVALID_CREDENTIALS, { message: 'Invalid credentials' });
    }
    if (account.role_id <= ROLE_TYPES.INACTIVE) {
      throw new ApiError(INVALID_CREDENTIALS, { message: 'Invalid credentials' });
    }
    const token = await jwt.sign({ id: account.id }, SECRET_KEY, { expiresIn: TOKEN_VALIDITY });
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
      qb.where('account.name ilike :nameSearch OR account.email ilike :emailSearch', { nameSearch: `%${filter.search}%`, emailSearch: `%${filter.search}%` });
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

  async update(id: string, name: string | undefined, email: string | undefined): Promise<AccountAPIModel> {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const account = await accountRepo.findOneByOrFail({ id });
    if (account.role_id == ROLE_TYPES.SUPERADMIN) {
      throw new ApiError(BAD_REQUEST, { message: 'Can not edit superadmin details' });
    }
    account.name = name ?? account.name;
    account.email = email === undefined ? account.email : email;
    const result = await accountRepo.save(account);
    return redactPassword(result);
  }

  async edit(id: string, name: string, email: string | undefined, role_id: ROLE_TYPES, reset_password: boolean, new_password: string | undefined, editor_role_id: ROLE_TYPES): Promise<AccountAPIModel> {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const account = await accountRepo.findOneByOrFail({ id });
    if (account.role_id >= editor_role_id) {
      throw new ApiError(BAD_REQUEST, { message: 'Can not edit account with similar or higher permissions than own account' });
    }
    if (role_id >= editor_role_id) {
      throw new ApiError(BAD_REQUEST, { message: 'Can not change account permissions to similar or higher than own account' });
    }
    if (reset_password) {
      if (!new_password) {
        throw new ApiError(BAD_REQUEST, { message: 'Must provide new_password when reset_password is true' });
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

  async delete(id: string, role_id: ROLE_TYPES): Promise<void> {
    const accountRepo = dashboardDataSource.getRepository(Account);
    const account = await accountRepo.findOneByOrFail({ id });
    if (account.role_id >= role_id) {
      throw new ApiError(BAD_REQUEST, { message: 'Can not delete account with similar or higher permissions than own account' });
    }
    await accountRepo.delete(account.id);
  }
}