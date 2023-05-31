import { connectionHook, sleep } from './jest.util';
import { AccountService } from '~/services/account.service';
import { notFoundId } from './constants';
import { EntityNotFoundError } from 'typeorm';
import { Account as AccountApiModel, AccountLoginResponse } from '~/api_models/account';
import { ApiError, BAD_REQUEST, INVALID_CREDENTIALS, PASSWORD_MISMATCH } from '~/utils/errors';
import { dashboardDataSource } from '~/data_sources/dashboard';
import Account from '~/models/account';
import { DEFAULT_LANGUAGE } from '~/utils/constants';
import { omitFields } from '~/utils/helpers';
import { FIXED_ROLE_TYPES } from '~/services/role.service';

describe('AccountService', () => {
  connectionHook();
  let accountService: AccountService;
  let accounts: Account[];
  let account5: AccountApiModel;
  let account5Login: AccountLoginResponse;

  beforeAll(async () => {
    accountService = new AccountService();
    accounts = await dashboardDataSource.manager.find(Account, { order: { name: 'ASC' } });
  });

  describe('create', () => {
    it('should create successfully', async () => {
      account5 = await accountService.create(
        'account5',
        'account5@test.com',
        'account5',
        FIXED_ROLE_TYPES.ADMIN,
        DEFAULT_LANGUAGE,
      );
      expect(omitFields(account5, ['create_time', 'update_time'])).toMatchObject({
        id: account5.id,
        name: 'account5',
        email: 'account5@test.com',
        role_id: FIXED_ROLE_TYPES.ADMIN,
      });
    });

    it('should fail', async () => {
      await expect(
        accountService.create('account5', 'account5@test.com', 'account5', FIXED_ROLE_TYPES.ADMIN, DEFAULT_LANGUAGE),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'An account with that name or email already exists' }),
      );
    });
  });

  describe('login', () => {
    it('should be successfull', async () => {
      account5Login = await accountService.login('account5', 'account5', DEFAULT_LANGUAGE);
      expect(account5Login).toMatchObject({
        token: account5Login.token,
        account: {
          ...omitFields(account5, ['create_time', 'update_time']),
        },
      });
    });

    it('should fail', async () => {
      await expect(accountService.login('incorrect name', 'incorrect password', DEFAULT_LANGUAGE)).rejects.toThrowError(
        new ApiError(INVALID_CREDENTIALS, { message: 'Invalid credentials' }),
      );
    });
  });

  describe('getByToken', () => {
    it('should return account', async () => {
      const account = await AccountService.getByToken(account5Login.token);
      expect(omitFields(account, ['create_time', 'update_time'])).toMatchObject({
        id: account5.id,
        name: 'account5',
        email: 'account5@test.com',
        role_id: FIXED_ROLE_TYPES.ADMIN,
      });
    });

    it('should return undefined', async () => {
      const account = await AccountService.getByToken(undefined);
      expect(account).toEqual(undefined);
    });
  });

  describe('get', () => {
    it('should return successfully', async () => {
      const account = await accountService.get(account5.id, DEFAULT_LANGUAGE);
      expect(account).toMatchObject(account5);
    });

    it('should fail', async () => {
      await expect(accountService.get(notFoundId, DEFAULT_LANGUAGE)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Account not found' }),
      );
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      account5 = await accountService.update(
        account5.id,
        'account5_updated',
        'account5_updated@test.test',
        DEFAULT_LANGUAGE,
      );
      expect(omitFields(account5, ['create_time', 'update_time'])).toMatchObject({
        id: account5.id,
        name: 'account5_updated',
        email: 'account5_updated@test.test',
        role_id: FIXED_ROLE_TYPES.ADMIN,
      });
    });

    it('should fail', async () => {
      await expect(accountService.update(notFoundId, 'xxxx', 'xxxx@xxx.xxx', DEFAULT_LANGUAGE)).rejects.toThrowError(
        EntityNotFoundError,
      );
    });

    it('updating superadmin should fail', async () => {
      await expect(
        accountService.update(accounts[4].id, 'superadmin', undefined, DEFAULT_LANGUAGE),
      ).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'Can not edit superadmin details' }));
    });
  });

  describe('edit', () => {
    it('should edit successfully', async () => {
      account5 = await accountService.edit(
        account5.id,
        'account5_updated_again',
        'account5_updated_again@test.test',
        FIXED_ROLE_TYPES.READER,
        false,
        undefined,
        DEFAULT_LANGUAGE,
      );
      expect(omitFields(account5, ['create_time', 'update_time'])).toMatchObject({
        id: account5.id,
        name: 'account5_updated_again',
        email: 'account5_updated_again@test.test',
        role_id: FIXED_ROLE_TYPES.READER,
      });
    });

    it('should fail when reset_password is true but new_password is empty', async () => {
      await expect(
        accountService.edit(
          account5.id,
          'account5_updated_again',
          'account5_updated_again@test.test',
          FIXED_ROLE_TYPES.READER,
          true,
          undefined,
          DEFAULT_LANGUAGE,
        ),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Must provide new_password when reset_password is true' }),
      );
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      let login = await accountService.login(account5.name, 'account5', DEFAULT_LANGUAGE);
      expect(login).toMatchObject({
        token: login.token,
        account: {
          ...omitFields(account5, ['create_time', 'update_time']),
          id: account5.id,
          name: 'account5_updated_again',
          email: 'account5_updated_again@test.test',
          role_id: FIXED_ROLE_TYPES.READER,
        },
      });

      await accountService.changePassword(account5.id, 'account5', 'account5_changed', DEFAULT_LANGUAGE);

      await expect(accountService.login(account5.name, 'account5', DEFAULT_LANGUAGE)).rejects.toThrowError(
        new ApiError(INVALID_CREDENTIALS, { message: 'Invalid credentials' }),
      );

      login = await accountService.login(account5.name, 'account5_changed', DEFAULT_LANGUAGE);
      expect(login).toMatchObject({
        token: login.token,
        account: {
          ...omitFields(account5, ['create_time', 'update_time']),
          id: account5.id,
          name: 'account5_updated_again',
          email: 'account5_updated_again@test.test',
          role_id: FIXED_ROLE_TYPES.READER,
        },
      });
    });

    it('should fail', async () => {
      await expect(
        accountService.changePassword(account5.id, 'account5', '123456789', DEFAULT_LANGUAGE),
      ).rejects.toThrowError(new ApiError(PASSWORD_MISMATCH, { message: 'Password is incorrect' }));
    });
  });

  describe('delete', () => {
    it('should delete successfully', async () => {
      let results = await accountService.list(undefined, [{ field: 'name', order: 'ASC' }], { page: 1, pagesize: 20 });
      expect(results).toMatchObject({
        total: 6,
        offset: 0,
        data: [
          {
            id: accounts[0].id,
            name: accounts[0].name,
            email: accounts[0].email,
            role_id: accounts[0].role_id,
          },
          {
            id: accounts[1].id,
            name: accounts[1].name,
            email: accounts[1].email,
            role_id: accounts[1].role_id,
          },
          {
            id: accounts[2].id,
            name: accounts[2].name,
            email: accounts[2].email,
            role_id: accounts[2].role_id,
          },
          {
            id: accounts[3].id,
            name: accounts[3].name,
            email: accounts[3].email,
            role_id: accounts[3].role_id,
          },
          {
            id: account5.id,
            name: account5.name,
            email: account5.email,
            role_id: account5.role_id,
          },
          {
            id: accounts[4].id,
            name: accounts[4].name,
            email: accounts[4].email,
            role_id: accounts[4].role_id,
          },
        ],
      });

      await accountService.delete(account5.id, DEFAULT_LANGUAGE);

      results = await accountService.list(undefined, [{ field: 'name', order: 'ASC' }], { page: 1, pagesize: 20 });
      expect(results).toMatchObject({
        total: 5,
        offset: 0,
        data: [
          {
            id: accounts[0].id,
            name: accounts[0].name,
            email: accounts[0].email,
            role_id: accounts[0].role_id,
          },
          {
            id: accounts[1].id,
            name: accounts[1].name,
            email: accounts[1].email,
            role_id: accounts[1].role_id,
          },
          {
            id: accounts[2].id,
            name: accounts[2].name,
            email: accounts[2].email,
            role_id: accounts[2].role_id,
          },
          {
            id: accounts[3].id,
            name: accounts[3].name,
            email: accounts[3].email,
            role_id: accounts[3].role_id,
          },
          {
            id: accounts[4].id,
            name: accounts[4].name,
            email: accounts[4].email,
            role_id: accounts[4].role_id,
          },
        ],
      });

      await sleep(5000);
    });

    it('should fail because not found', async () => {
      await expect(accountService.delete(account5.id, DEFAULT_LANGUAGE)).rejects.toThrowError(EntityNotFoundError);
    });

    it('should fail because of permission', async () => {
      await expect(accountService.delete(accounts[4].id, DEFAULT_LANGUAGE)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, {
          message: 'Can not delete superadmin account',
        }),
      );
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const results = await accountService.list(undefined, [{ field: 'name', order: 'ASC' }], {
        page: 1,
        pagesize: 20,
      });
      expect(results).toMatchObject({
        total: 5,
        offset: 0,
        data: [
          {
            id: accounts[0].id,
            name: accounts[0].name,
            email: accounts[0].email,
            role_id: accounts[0].role_id,
          },
          {
            id: accounts[1].id,
            name: accounts[1].name,
            email: accounts[1].email,
            role_id: accounts[1].role_id,
          },
          {
            id: accounts[2].id,
            name: accounts[2].name,
            email: accounts[2].email,
            role_id: accounts[2].role_id,
          },
          {
            id: accounts[3].id,
            name: accounts[3].name,
            email: accounts[3].email,
            role_id: accounts[3].role_id,
          },
          {
            id: accounts[4].id,
            name: accounts[4].name,
            email: accounts[4].email,
            role_id: accounts[4].role_id,
          },
        ],
      });
    });

    it('with search filter', async () => {
      const results = await accountService.list(
        { name: { value: 'account', isFuzzy: true }, email: { value: 'account', isFuzzy: true } },
        [{ field: 'name', order: 'ASC' }],
        { page: 1, pagesize: 20 },
      );
      expect(results).toMatchObject({
        total: 4,
        offset: 0,
        data: [
          {
            id: accounts[0].id,
            name: accounts[0].name,
            email: accounts[0].email,
            role_id: accounts[0].role_id,
          },
          {
            id: accounts[1].id,
            name: accounts[1].name,
            email: accounts[1].email,
            role_id: accounts[1].role_id,
          },
          {
            id: accounts[2].id,
            name: accounts[2].name,
            email: accounts[2].email,
            role_id: accounts[2].role_id,
          },
          {
            id: accounts[3].id,
            name: accounts[3].name,
            email: accounts[3].email,
            role_id: accounts[3].role_id,
          },
        ],
      });
    });
  });
});
