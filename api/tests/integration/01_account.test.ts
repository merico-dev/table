import { connectionHook } from './jest.util';
import { AccountService } from '../../src/services/account.service';
import { notFoundId } from './constants';
import { ROLE_TYPES } from '~/api_models/role';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { Account as AccountApiModel, AccountLoginResponse } from '~/api_models/account';
import { ApiError, BAD_REQUEST, INVALID_CREDENTIALS, PASSWORD_MISMATCH } from '~/utils/errors';
import { dashboardDataSource } from '~/data_sources/dashboard';
import Account from '~/models/account';

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
      account5 = await accountService.create('account5', 'account5@test.com', 'account5', ROLE_TYPES.ADMIN);
      expect(account5).toMatchObject({
        id: account5.id,
        name: 'account5',
        email: 'account5@test.com',
        role_id: ROLE_TYPES.ADMIN,
        create_time: account5.create_time,
        update_time: account5.update_time,
      });
    });

    it('should fail', async () => {
      await expect(
        accountService.create('account5', 'account5@test.com', 'account5', ROLE_TYPES.ADMIN),
      ).rejects.toThrowError(QueryFailedError);
    });
  });

  describe('login', () => {
    it('should be successfull', async () => {
      account5Login = await accountService.login('account5', 'account5');
      expect(account5Login).toMatchObject({
        token: account5Login.token,
        account: {
          id: account5.id,
          name: account5.name,
          email: account5.email,
          role_id: account5.role_id,
          create_time: account5.create_time,
          update_time: account5.update_time,
        },
      });
    });

    it('should fail', async () => {
      await expect(accountService.login('incorrect name', 'incorrect password')).rejects.toThrowError(
        new ApiError(INVALID_CREDENTIALS, { message: 'Invalid credentials' }),
      );
    });
  });

  describe('getByToken', () => {
    it('should return account', async () => {
      const account = await AccountService.getByToken(account5Login.token);
      expect(account).toMatchObject({
        id: account5.id,
        create_time: account5.create_time,
        update_time: account5.update_time,
        name: 'account5',
        email: 'account5@test.com',
        role_id: ROLE_TYPES.ADMIN,
      });
    });

    it('should return null', async () => {
      const account = await AccountService.getByToken(undefined);
      expect(account).toEqual(null);
    });
  });

  describe('get', () => {
    it('should return successfully', async () => {
      const account = await accountService.get(account5.id);
      expect(account).toMatchObject(account5);
    });

    it('should fail', async () => {
      await expect(accountService.get(notFoundId)).rejects.toThrowError(EntityNotFoundError);
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      account5 = await accountService.update(account5.id, 'account5_updated', 'account5_updated@test.test');
      expect(account5).toMatchObject({
        id: account5.id,
        create_time: account5.create_time,
        update_time: account5.update_time,
        name: 'account5_updated',
        email: 'account5_updated@test.test',
        role_id: ROLE_TYPES.ADMIN,
      });
    });

    it('should fail', async () => {
      await expect(accountService.update(notFoundId, 'xxxx', 'xxxx@xxx.xxx')).rejects.toThrowError(EntityNotFoundError);
    });

    it('updating superadmin should fail', async () => {
      await expect(accountService.update(accounts[4].id, undefined, undefined)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Can not edit superadmin details' }),
      );
    });
  });

  describe('edit', () => {
    it('should edit successfully', async () => {
      account5 = await accountService.edit(
        account5.id,
        'account5_updated_again',
        'account5_updated_again@test.test',
        ROLE_TYPES.READER,
        false,
        undefined,
        ROLE_TYPES.SUPERADMIN,
      );
      expect(account5).toMatchObject({
        id: account5.id,
        create_time: account5.create_time,
        update_time: account5.update_time,
        name: 'account5_updated_again',
        email: 'account5_updated_again@test.test',
        role_id: ROLE_TYPES.READER,
      });
    });

    it('should fail when editing with insufficient privileges', async () => {
      await expect(
        accountService.edit(
          account5.id,
          'account5_updated_again',
          'account5_updated_again@test.test',
          ROLE_TYPES.AUTHOR,
          false,
          undefined,
          ROLE_TYPES.READER,
        ),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, {
          message: 'Can not edit account with similar or higher permissions than own account',
        }),
      );
    });

    it('should fail when editing role_id to higher or similar to own', async () => {
      await expect(
        accountService.edit(
          account5.id,
          'account5_updated_again',
          'account5_updated_again@test.test',
          ROLE_TYPES.AUTHOR,
          false,
          undefined,
          ROLE_TYPES.AUTHOR,
        ),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, {
          message: 'Can not change account permissions to similar or higher than own account',
        }),
      );
    });

    it('should fail when reset_password is true but new_password is empty', async () => {
      await expect(
        accountService.edit(
          account5.id,
          'account5_updated_again',
          'account5_updated_again@test.test',
          ROLE_TYPES.READER,
          true,
          undefined,
          ROLE_TYPES.SUPERADMIN,
        ),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Must provide new_password when reset_password is true' }),
      );
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      let login = await accountService.login(account5.name, 'account5');
      expect(login).toMatchObject({
        token: login.token,
        account: {
          id: account5.id,
          create_time: account5.create_time,
          update_time: login.account.update_time,
          name: 'account5_updated_again',
          email: 'account5_updated_again@test.test',
          role_id: ROLE_TYPES.READER,
        },
      });

      await accountService.changePassword(account5.id, 'account5', 'account5_changed');

      await expect(accountService.login(account5.name, 'account5')).rejects.toThrowError(
        new ApiError(INVALID_CREDENTIALS, { message: 'Invalid credentials' }),
      );

      login = await accountService.login(account5.name, 'account5_changed');
      expect(login).toMatchObject({
        token: login.token,
        account: {
          id: account5.id,
          create_time: account5.create_time,
          update_time: login.account.update_time,
          name: 'account5_updated_again',
          email: 'account5_updated_again@test.test',
          role_id: ROLE_TYPES.READER,
        },
      });
    });

    it('should fail', async () => {
      await expect(accountService.changePassword(account5.id, 'account5', '123456789')).rejects.toThrowError(
        new ApiError(PASSWORD_MISMATCH),
      );
    });
  });

  describe('delete', () => {
    it('should delete successfully', async () => {
      let results = await accountService.list(undefined, { field: 'name', order: 'ASC' }, { page: 1, pagesize: 20 });
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

      await accountService.delete(account5.id, ROLE_TYPES.SUPERADMIN);

      results = await accountService.list(undefined, { field: 'name', order: 'ASC' }, { page: 1, pagesize: 20 });
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

    it('should fail because not found', async () => {
      await expect(accountService.delete(account5.id, ROLE_TYPES.SUPERADMIN)).rejects.toThrowError(EntityNotFoundError);
    });

    it('should fail because of permission', async () => {
      await expect(accountService.delete(accounts[4].id, ROLE_TYPES.INACTIVE)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, {
          message: 'Can not delete account with similar or higher permissions than own account',
        }),
      );
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const results = await accountService.list(undefined, { field: 'name', order: 'ASC' }, { page: 1, pagesize: 20 });
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
        { search: 'account' },
        { field: 'name', order: 'ASC' },
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
