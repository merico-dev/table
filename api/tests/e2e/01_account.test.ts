import { connectionHook } from './jest.util';
import { dashboardDataSource } from '~/data_sources/dashboard';
import Account from '~/models/account';
import {
  Account as AccountAPIModel,
  AccountChangePasswordRequest,
  AccountCreateRequest,
  AccountEditRequest,
  AccountIDRequest,
  AccountListRequest,
  AccountLoginRequest,
  AccountUpdateRequest,
} from '~/api_models/account';
import { ROLE_TYPES } from '~/api_models/role';
import { AccountLoginResponse } from '~/api_models/account';
import { omit } from 'lodash';
import * as validation from '~/middleware/validation';
import request from 'supertest';
import { app } from '~/server';

describe('AccountController', () => {
  connectionHook();
  let superadmin: Account;
  let account1: AccountAPIModel;
  let account2: AccountAPIModel;
  let superadminLogin: AccountLoginResponse;
  let account1Login: AccountLoginResponse;
  let account2Login: AccountLoginResponse;
  const server = request(app);

  const validate = jest.spyOn(validation, 'validate');

  beforeAll(async () => {
    superadmin = await dashboardDataSource.manager.findOne(Account, { where: { name: 'superadmin' } });
  });

  beforeEach(() => {
    validate.mockReset();
  });

  describe('login', () => {
    it('should be successfull', async () => {
      const query: AccountLoginRequest = {
        name: superadmin.name,
        password: process.env.SUPER_ADMIN_PASSWORD ?? 'secret',
      };
      validate.mockReturnValueOnce(query);

      const response = await server.post('/account/login').send(query);

      superadminLogin = response.body;
      superadminLogin.account.create_time = new Date(superadminLogin.account.create_time);
      superadminLogin.account.update_time = new Date(superadminLogin.account.update_time);
      expect(superadminLogin).toMatchObject({
        token: superadminLogin.token,
        account: {
          id: superadmin.id,
          create_time: superadmin.create_time,
          update_time: superadmin.update_time,
          name: superadmin.name,
          email: superadmin.email,
          role_id: superadmin.role_id,
        },
      });
    });

    it('should fail with invalid credentials', async () => {
      const query: AccountLoginRequest = {
        name: superadmin.name,
        password: 'incorrect password',
      };
      validate.mockReturnValueOnce(query);

      const response = await server.post('/account/login').send(query);

      expect(response.body).toMatchObject({
        code: 'INVALID_CREDENTIALS',
        detail: { message: 'Invalid credentials' },
      });
    });
  });

  describe('create', () => {
    it('should create successfully', async () => {
      const createQuery1: AccountCreateRequest = {
        name: 'account1',
        password: 'account1',
        email: 'account1@test.com',
        role_id: ROLE_TYPES.ADMIN,
      };
      validate.mockReturnValueOnce(createQuery1);

      const createResponse1 = await server
        .post('/account/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(createQuery1);

      createResponse1.body.create_time = new Date(createResponse1.body.create_time);
      createResponse1.body.update_time = new Date(createResponse1.body.update_time);
      expect(createResponse1.body).toMatchObject({
        name: 'account1',
        email: 'account1@test.com',
        role_id: ROLE_TYPES.ADMIN,
        id: createResponse1.body.id,
        create_time: createResponse1.body.create_time,
        update_time: createResponse1.body.update_time,
      });
      account1 = createResponse1.body;

      const loginQuery1: AccountLoginRequest = {
        name: account1.name,
        password: 'account1',
      };
      validate.mockReturnValueOnce(loginQuery1);

      const loginResponse1 = await server.post('/account/login').send(loginQuery1);

      account1Login = loginResponse1.body;
      account1Login.account.create_time = new Date(account1Login.account.create_time);
      account1Login.account.update_time = new Date(account1Login.account.update_time);
      expect(account1Login).toMatchObject({
        token: account1Login.token,
        account: {
          id: account1.id,
          create_time: account1.create_time,
          update_time: account1.update_time,
          name: account1.name,
          email: account1.email,
          role_id: account1.role_id,
        },
      });

      const createQuery2: AccountCreateRequest = {
        name: 'account2',
        password: 'account2',
        email: 'account2@test.com',
        role_id: ROLE_TYPES.ADMIN,
      };
      validate.mockReturnValueOnce(createQuery2);

      const createReponse2 = await server
        .post('/account/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(createQuery2);

      createReponse2.body.create_time = new Date(createReponse2.body.create_time);
      createReponse2.body.update_time = new Date(createReponse2.body.update_time);
      expect(createReponse2.body).toMatchObject({
        name: 'account2',
        email: 'account2@test.com',
        role_id: ROLE_TYPES.ADMIN,
        id: createReponse2.body.id,
        create_time: createReponse2.body.create_time,
        update_time: createReponse2.body.update_time,
      });
      account2 = createReponse2.body;

      const loginQuery2: AccountLoginRequest = {
        name: account2.name,
        password: 'account2',
      };
      validate.mockReturnValueOnce(loginQuery2);

      const loginResponse2 = await server.post('/account/login').send(loginQuery2);

      account2Login = loginResponse2.body;
      account2Login.account.create_time = new Date(account2Login.account.create_time);
      account2Login.account.update_time = new Date(account2Login.account.update_time);
      expect(account2Login).toMatchObject({
        token: account2Login.token,
        account: {
          id: account2.id,
          create_time: account2.create_time,
          update_time: account2.update_time,
          name: account2.name,
          email: account2.email,
          role_id: account2.role_id,
        },
      });
    });

    it('should fail because duplicate', async () => {
      const query: AccountCreateRequest = {
        name: 'account1',
        password: 'account1',
        email: 'account1@test.com',
        role_id: ROLE_TYPES.ADMIN,
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .post('/account/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: {
          message: 'An account with that name or email already exists',
        },
      });
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const query: AccountListRequest = {
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'name', order: 'ASC' }],
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .post('/account/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: response.body.data[0].id,
            name: 'account1',
            email: 'account1@test.com',
            role_id: ROLE_TYPES.ADMIN,
          },
          {
            id: response.body.data[1].id,
            name: 'account2',
            email: 'account2@test.com',
            role_id: ROLE_TYPES.ADMIN,
          },
          {
            id: response.body.data[2].id,
            name: 'superadmin',
            email: null,
            role_id: ROLE_TYPES.SUPERADMIN,
          },
        ],
      });
    });

    it('with search filter', async () => {
      const query: AccountListRequest = {
        filter: { name: { value: 'account', isFuzzy: true }, email: { value: 'account', isFuzzy: true } },
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'name', order: 'ASC' }],
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .post('/account/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        total: 2,
        offset: 0,
        data: [
          {
            id: account1.id,
            name: account1.name,
            email: account1.email,
            role_id: account1.role_id,
          },
          {
            id: account2.id,
            name: account2.name,
            email: account2.email,
            role_id: account2.role_id,
          },
        ],
      });
    });
  });

  describe('edit', () => {
    it('should edit successfully', async () => {
      const query: AccountEditRequest = {
        id: account1.id,
        name: 'account1_edited',
        email: 'account1_edited@test.com',
        role_id: ROLE_TYPES.AUTHOR,
        reset_password: false,
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .put('/account/edit')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      response.body.create_time = new Date(response.body.create_time);
      response.body.update_time = new Date(response.body.update_time);
      expect(response.body).toMatchObject({
        id: account1.id,
        create_time: response.body.create_time,
        update_time: response.body.update_time,
        name: 'account1_edited',
        email: 'account1_edited@test.com',
        role_id: ROLE_TYPES.AUTHOR,
      });
      account1 = response.body;
    });

    it('should fail when editing with insufficient privileges', async () => {
      const query: AccountEditRequest = {
        id: superadmin.id,
        name: 'superadmin_edited',
        email: 'superadmin_edited@test.com',
        role_id: ROLE_TYPES.ADMIN,
        reset_password: false,
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .put('/account/edit')
        .set('Authorization', `Bearer ${account2Login.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: {
          message: 'Can not edit account with similar or higher privileges than own account',
        },
      });
    });

    it('should fail when editing own account', async () => {
      const query: AccountEditRequest = {
        id: account2.id,
        name: 'account2_edited',
        email: 'account2_edited@test.com',
        role_id: ROLE_TYPES.ADMIN,
        reset_password: false,
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .put('/account/edit')
        .set('Authorization', `Bearer ${account2Login.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: {
          message: 'Can not edit own account. Use /account/update instead',
        },
      });
    });

    it('should fail when editing role_id to higher than own', async () => {
      const query: AccountEditRequest = {
        id: account1.id,
        name: 'account1_edited',
        email: 'account1_edited@test.com',
        role_id: ROLE_TYPES.ADMIN,
        reset_password: false,
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .put('/account/edit')
        .set('Authorization', `Bearer ${account2Login.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: {
          message: 'Can not change account privileges to similar or higher than own account',
        },
      });
    });

    it('should fail when reset_password is true but new_password is empty', async () => {
      const query: AccountEditRequest = {
        id: account1.id,
        name: 'account1_edited',
        email: 'account1_edited@test.com',
        role_id: ROLE_TYPES.AUTHOR,
        reset_password: true,
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .put('/account/edit')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'Must provide new_password when reset_password is true' },
      });
    });

    it('should edit successfully with new password', async () => {
      const query: AccountEditRequest = {
        id: account1.id,
        name: 'account1_edited_password',
        email: 'account1_edited_password@test.com',
        role_id: ROLE_TYPES.ADMIN,
        reset_password: true,
        new_password: 'account1_edited_password',
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .put('/account/edit')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      response.body.create_time = new Date(response.body.create_time);
      response.body.update_time = new Date(response.body.update_time);
      expect(response.body).toMatchObject({
        id: account1.id,
        create_time: response.body.create_time,
        update_time: response.body.update_time,
        name: 'account1_edited_password',
        email: 'account1_edited_password@test.com',
        role_id: ROLE_TYPES.ADMIN,
      });
      account1 = response.body;

      const loginQuery: AccountLoginRequest = {
        name: 'account1_edited_password',
        password: 'account1_edited_password',
      };
      validate.mockReturnValueOnce(loginQuery);

      const loginResponse = await server.post('/account/login').send(loginQuery);

      loginResponse.body.account.create_time = new Date(loginResponse.body.account.create_time);
      loginResponse.body.account.update_time = new Date(loginResponse.body.account.update_time);
      expect(loginResponse.body).toMatchObject({
        token: loginResponse.body.token,
        account: {
          id: account1.id,
          create_time: account1.create_time,
          update_time: loginResponse.body.account.update_time,
          name: account1.name,
          email: account1.email,
          role_id: account1.role_id,
        },
      });
    });
  });

  describe('delete', () => {
    it('should fail because of permission', async () => {
      const query: AccountIDRequest = {
        id: account1.id,
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .post('/account/delete')
        .set('Authorization', `Bearer ${account2Login.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: {
          message: 'Can not delete account with similar or higher privileges than own account',
        },
      });
    });

    it('should delete successfully', async () => {
      const query: AccountIDRequest = {
        id: account1.id,
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .post('/account/delete')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({ id: account1.id });
    });

    it('should fail because not found', async () => {
      const query: AccountIDRequest = {
        id: account1.id,
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .post('/account/delete')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.detail.message).toContain('Could not find any entity of type "Account" matching');
      expect(response.body.detail.message).toContain(account1.id);
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const query: AccountUpdateRequest = {
        name: 'account2_updated',
        email: 'account2_updated@test.com',
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .put('/account/update')
        .set('Authorization', `Bearer ${account2Login.token}`)
        .send(query);

      response.body.create_time = new Date(response.body.create_time);
      response.body.update_time = new Date(response.body.update_time);
      expect(response.body).toMatchObject({
        id: account2.id,
        create_time: account2.create_time,
        update_time: response.body.update_time,
        name: 'account2_updated',
        email: 'account2_updated@test.com',
        role_id: ROLE_TYPES.ADMIN,
      });
      account2 = response.body;
    });

    it('should fail if not found', async () => {
      const query: AccountUpdateRequest = {
        name: 'account1_updated',
        email: 'account1_updated@test.com',
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .put('/account/update')
        .set('Authorization', `Bearer ${account1Login.token}`)
        .send(query);

      expect(response.body).toMatchObject({ code: 'UNAUTHORIZED', detail: { message: 'Not authenticated' } });
    });

    it('updating superadmin should fail', async () => {
      const query: AccountUpdateRequest = {
        name: 'superadmin_updated',
        email: 'superadmin_updated@test.com',
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .put('/account/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'Can not edit superadmin details' },
      });
    });
  });

  describe('get', () => {
    it('should return successfully', async () => {
      const response = await server.get('/account/get').set('Authorization', `Bearer ${superadminLogin.token}`).send();

      response.body.create_time = new Date(response.body.create_time);
      response.body.update_time = new Date(response.body.update_time);
      expect(response.body).toMatchObject(
        omit(
          {
            ...superadmin,
            create_time: superadmin.create_time,
            update_time: superadmin.update_time,
          },
          'password',
        ),
      );
    });

    it('should fail if not found', async () => {
      const response = await server.get('/account/get').set('Authorization', `Bearer ${account1Login.token}`).send();

      expect(response.body).toMatchObject({ code: 'UNAUTHORIZED', detail: { message: 'Not authenticated' } });
    });
  });

  describe('changePassword', () => {
    it('should fail if password mismatch', async () => {
      const query: AccountChangePasswordRequest = {
        old_password: 'account2_old',
        new_password: 'account2_new',
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .post('/account/changepassword')
        .set('Authorization', `Bearer ${account2Login.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        code: 'PASSWORD_MISMATCH',
      });
    });

    it('should change password successfully', async () => {
      const loginQuery1: AccountLoginRequest = {
        name: account2.name,
        password: 'account2',
      };
      validate.mockReturnValueOnce(loginQuery1);

      const loginResponse1 = await server.post('/account/login').send(loginQuery1);

      loginResponse1.body.account.create_time = new Date(loginResponse1.body.account.create_time);
      expect(loginResponse1.body).toMatchObject({
        token: loginResponse1.body.token,
        account: {
          id: account2.id,
          create_time: account2.create_time,
          update_time: loginResponse1.body.account.update_time,
          name: account2.name,
          email: account2.email,
          role_id: account2.role_id,
        },
      });

      const changeQuery: AccountChangePasswordRequest = {
        old_password: 'account2',
        new_password: 'account2_new',
      };
      validate.mockReturnValueOnce(changeQuery);

      const changeResponse = await server
        .post('/account/changepassword')
        .set('Authorization', `Bearer ${account2Login.token}`)
        .send(changeQuery);

      changeResponse.body.create_time = new Date(changeResponse.body.create_time);
      expect(changeResponse.body).toMatchObject({
        id: account2.id,
        create_time: account2.create_time,
        update_time: changeResponse.body.update_time,
        name: account2.name,
        email: account2.email,
        role_id: account2.role_id,
      });

      const loginQuery2: AccountLoginRequest = {
        name: account2.name,
        password: 'account2',
      };
      validate.mockReturnValueOnce(loginQuery2);

      const loginResponse2 = await server.post('/account/login').send(loginQuery2);

      expect(loginResponse2.body).toMatchObject({
        code: 'INVALID_CREDENTIALS',
        detail: { message: 'Invalid credentials' },
      });

      const loginQuery3: AccountLoginRequest = {
        name: account2.name,
        password: 'account2_new',
      };
      validate.mockReturnValueOnce(loginQuery3);

      const loginResponse3 = await server.post('/account/login').send(loginQuery3);

      loginResponse3.body.account.create_time = new Date(loginResponse3.body.account.create_time);
      expect(loginResponse3.body).toMatchObject({
        token: loginResponse3.body.token,
        account: {
          id: account2.id,
          create_time: account2.create_time,
          update_time: loginResponse3.body.account.update_time,
          name: account2.name,
          email: account2.email,
          role_id: account2.role_id,
        },
      });
    });
  });
});
