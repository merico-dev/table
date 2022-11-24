import { connectionHook } from './jest.util';
import { AccountService } from '../../src/services/account.service';
import { dashboardDataSource } from '~/data_sources/dashboard';
import Account from '~/models/account';
import { Account as AccountAPIModel } from '~/api_models/account';
import { ROLE_TYPES } from '~/api_models/role';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { ApiError, BAD_REQUEST, INVALID_CREDENTIALS, PASSWORD_MISMATCH } from '~/utils/errors';
import { AccountLoginResponse } from '~/api_models/account';
import { omit } from 'lodash';

describe('AccountService', () => {
  connectionHook();
  let accountService: AccountService;
  let superadmin: Account;
  let testAccount1: AccountAPIModel;
  let superadminLogin: AccountLoginResponse;

  beforeAll(async () => {
    accountService = new AccountService();
    superadmin = await dashboardDataSource.manager.findOne(Account, { where: { name: 'superadmin' } });

    superadminLogin = await accountService.login(superadmin.name, process.env.SUPER_ADMIN_PASSWORD ?? 'secret');
  });

  describe('create', () => {
    it('should be successfull', async () => {
      testAccount1 = await accountService.create('test_1', 'test_1@test.test', '12345678', ROLE_TYPES.AUTHOR);
      expect(testAccount1).toMatchObject({
        name: 'test_1',
        email: 'test_1@test.test',
        role_id: 30,
        id: testAccount1.id,
        create_time: testAccount1.create_time,
        update_time: testAccount1.update_time,
      });
    });

    it('should fail', async () => {
      await expect(accountService.create('test_1', 'test_1@test.test', '12345678', ROLE_TYPES.AUTHOR)).rejects.toThrowError(QueryFailedError);
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const accounts = await accountService.list(undefined, { field: 'create_time', order: 'ASC' }, { page: 1, pagesize: 20 });
      expect(accounts).toMatchObject({
        total: 2,
        offset: 0,
        data: [
          {
            id: accounts.data[0].id,
            name: 'superadmin',
            email: null,
            role_id: 50
          },
          {
            id: accounts.data[1].id,
            name: 'test_1',
            email: 'test_1@test.test',
            role_id: 30
          }
        ]
      });
    });

    it('with search filter', async () => {
      const accounts = await accountService.list({ search: 'test' }, { field: 'create_time', order: 'ASC' }, { page: 1, pagesize: 20 });
      expect(accounts).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: accounts.data[0].id,
            name: 'test_1',
            email: 'test_1@test.test',
            role_id: 30
          }
        ]
      });
    });
  });

  describe('login', () => {
    it('should be successfull', async () => {
      const login = await accountService.login('test_1', '12345678');
      expect(login).toMatchObject({
        token: login.token,
        account: {
          id: login.account.id,
          create_time: login.account.create_time,
          update_time: login.account.update_time,
          name: 'test_1',
          email: 'test_1@test.test',
          role_id: 30
        }
      });
    });

    it('should fail', async () => {
      await expect(accountService.login('test', 'incorrect password')).rejects.toThrowError(new ApiError(INVALID_CREDENTIALS, { message: 'Invalid credentials' }));
    });
  });

  describe('getByToken', () => {
    it('should return account', async () => {
      const account = await AccountService.getByToken(superadminLogin.token);
      expect(account).toMatchObject({
        id: superadmin.id,
        create_time: superadmin.create_time,
        update_time: superadmin.update_time,
        name: 'superadmin',
        email: null,
        role_id: 50
      });
    });

    it('should return null', async () => {
      const account = await AccountService.getByToken(undefined);
      expect(account).toEqual(null);
    });
  });

  describe('get', () => {
    it('should return successfully', async () => {
      const account = await accountService.get(superadmin.id);
      expect(account).toMatchObject(omit(superadmin, 'password'));
    });

    it('should fail', async () => {
      await expect(accountService.get('3e7acce4-b8cd-4c01-b009-d2ea33a07258')).rejects.toThrowError(EntityNotFoundError);
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      testAccount1 = await accountService.update(testAccount1.id, 'test_1_updated', 'test_1_updated@test.test');
      expect(testAccount1).toMatchObject({
        id: testAccount1.id,
        create_time: testAccount1.create_time,
        update_time: testAccount1.update_time,
        name: 'test_1_updated',
        email: 'test_1_updated@test.test',
        role_id: 30
      });
    });

    it('should fail', async () => {
      await expect(accountService.update('3e7acce4-b8cd-4c01-b009-d2ea33a07258', 'xxxx', 'xxxx@xxx.xxx')).rejects.toThrowError(EntityNotFoundError);
    });

    it('updating superadmin should fail', async () => {
      await expect(accountService.update(superadmin.id, undefined, undefined)).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'Can not edit superadmin details' }));
    });
  });

  describe('edit', () => {
    it('should edit successfully', async () => {
      testAccount1 = await accountService.edit(testAccount1.id, 'test_1_updated_again', 'test_1_updated_again@test.test', ROLE_TYPES.READER, false, undefined, superadmin.role_id);
      expect(testAccount1).toMatchObject({
        id: testAccount1.id,
        create_time: testAccount1.create_time,
        update_time: testAccount1.update_time,
        name: 'test_1_updated_again',
        email: 'test_1_updated_again@test.test',
        role_id: 20
      });
    });

    it('should fail when editing with insufficient privileges', async () => {
      await expect(accountService.edit(testAccount1.id, 'test_1_updated_again', 'test_1_updated_again@test.test', ROLE_TYPES.AUTHOR, false, undefined, ROLE_TYPES.READER)).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'Can not edit account with similar or higher permissions than own account' }));
    });

    it('should fail when editing role_id to higher than own', async () => {
      await expect(accountService.edit(testAccount1.id, 'test_1_updated_again', 'test_1_updated_again@test.test', ROLE_TYPES.AUTHOR, false, undefined, ROLE_TYPES.AUTHOR)).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'Can not change account permissions to similar or higher than own account' }));
    });

    it('should fail when reset_password is true but new_password is empty', async () => {
      await expect(accountService.edit(testAccount1.id, 'test_1_updated_again', 'test_1_updated_again@test.test', ROLE_TYPES.READER, true, undefined, superadmin.role_id)).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'Must provide new_password when reset_password is true' }));
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      let login = await accountService.login('test_1_updated_again', '12345678');
      expect(login).toMatchObject({
        token: login.token,
        account: {
          id: login.account.id,
          create_time: login.account.create_time,
          update_time: login.account.update_time,
          name: 'test_1_updated_again',
          email: 'test_1_updated_again@test.test',
          role_id: 20
        }
      });

      await accountService.changePassword(testAccount1.id, '12345678', '123456789');

      await expect(accountService.login('test_1_updated_again', '12345678')).rejects.toThrowError(new ApiError(INVALID_CREDENTIALS, { message: 'Invalid credentials' }));

      login = await accountService.login('test_1_updated_again', '123456789');
      expect(login).toMatchObject({
        token: login.token,
        account: {
          id: login.account.id,
          create_time: login.account.create_time,
          update_time: login.account.update_time,
          name: 'test_1_updated_again',
          email: 'test_1_updated_again@test.test',
          role_id: 20
        }
      });
    });

    it('should fail', async () => {
      await expect(accountService.changePassword(testAccount1.id, '12345678', '123456789')).rejects.toThrowError(new ApiError(PASSWORD_MISMATCH));
    });
  });

  describe('delete', () => {
    it('should delete successfully', async () => {
      let accounts = await accountService.list(undefined, { field: 'create_time', order: 'ASC' }, { page: 1, pagesize: 20 });
      expect(accounts).toMatchObject({
        total: 2,
        offset: 0,
        data: [
          {
            id: accounts.data[0].id,
            name: 'superadmin',
            email: null,
            role_id: 50
          },
          {
            id: accounts.data[1].id,
            name: 'test_1_updated_again',
            email: 'test_1_updated_again@test.test',
            role_id: 20
          }
        ]
      });

      await accountService.delete(testAccount1.id, superadmin.role_id);

      accounts = await accountService.list(undefined, { field: 'create_time', order: 'ASC' }, { page: 1, pagesize: 20 });
      expect(accounts).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: accounts.data[0].id,
            name: 'superadmin',
            email: null,
            role_id: 50
          }
        ]
      });
    });

    it('should fail because not found', async () => {
      await expect(accountService.delete(testAccount1.id, superadmin.role_id)).rejects.toThrowError(EntityNotFoundError);
    });

    it('should fail because of permission', async () => {
      await expect(accountService.delete(superadmin.id, ROLE_TYPES.INACTIVE)).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'Can not delete account with similar or higher permissions than own account' }));
    });
  });
});