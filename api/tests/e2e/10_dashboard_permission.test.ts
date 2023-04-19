import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { connectionHook, createAuthStruct } from './jest.util';
import { app } from '~/server';
import request from 'supertest';
import { AccountLoginRequest, AccountLoginResponse } from '~/api_models/account';
import {
  DashboardOwnerUpdateRequest,
  DashboardPermissionListRequest,
  DashboardPermissionUpdateRequest,
} from '~/api_models/dashboard_permission';
import { dashboardDataSource } from '~/data_sources/dashboard';
import ApiKey from '~/models/apiKey';
import Account from '~/models/account';
import { ROLE_TYPES } from '~/api_models/role';
import { SALT_ROUNDS } from '~/utils/constants';
import Dashboard from '~/models/dashboard';
import DashboardPermission from '~/models/dashboard_permission';
import { DashboardIDRequest, DashboardUpdateRequest } from '~/api_models/dashboard';
import { omitTime } from '~/utils/helpers';

describe('DashboardPermissionController', () => {
  connectionHook();
  let superadminLogin: AccountLoginResponse;
  let readerLogin: AccountLoginResponse;
  let authorLogin: AccountLoginResponse;

  let readerAccount: Account;
  let authorAccount: Account;
  let readerApiKey: ApiKey;
  let authorApiKey: ApiKey;

  let dashboardId1: string;
  let dashboardId2: string;
  let dashboardId3: string;
  let dashboardId4: string;
  let dashboardId5: string;

  const server = request(app);

  beforeAll(async () => {
    const readerAccountData = new Account();
    readerAccountData.name = 'reader_dashboard_permission';
    readerAccountData.email = 'reader_dashboard@permission.test';
    readerAccountData.password = await bcrypt.hash(readerAccountData.name, SALT_ROUNDS);
    readerAccountData.role_id = ROLE_TYPES.READER;
    readerAccount = await dashboardDataSource.getRepository(Account).save(readerAccountData);

    const authorAccountData = new Account();
    authorAccountData.name = 'author_dashboard_permission';
    authorAccountData.email = 'author_dashboard@permission.test';
    authorAccountData.password = await bcrypt.hash(authorAccountData.name, SALT_ROUNDS);
    authorAccountData.role_id = ROLE_TYPES.AUTHOR;
    authorAccount = await dashboardDataSource.getRepository(Account).save(authorAccountData);

    const readerApiKeyData = new ApiKey();
    readerApiKeyData.name = 'reader_dashboard_permission';
    readerApiKeyData.app_id = crypto.randomBytes(8).toString('hex');
    readerApiKeyData.app_secret = crypto.randomBytes(16).toString('hex');
    readerApiKeyData.role_id = ROLE_TYPES.READER;
    readerApiKey = await dashboardDataSource.getRepository(ApiKey).save(readerApiKeyData);

    const authorApiKeyData = new ApiKey();
    authorApiKeyData.name = 'author_dashboard_permission';
    authorApiKeyData.app_id = crypto.randomBytes(8).toString('hex');
    authorApiKeyData.app_secret = crypto.randomBytes(16).toString('hex');
    authorApiKeyData.role_id = ROLE_TYPES.AUTHOR;
    authorApiKey = await dashboardDataSource.getRepository(ApiKey).save(authorApiKeyData);

    const dashboardData = new Dashboard();
    dashboardData.name = 'dashboard_permission';
    dashboardData.group = 'dashboard_permission';
    dashboardData.is_preset = false;
    const dashboard = await dashboardDataSource.getRepository(Dashboard).save(dashboardData);
    dashboardId5 = dashboard.id;

    const dashboardPermissionData = new DashboardPermission();
    dashboardPermissionData.id = dashboardId5;
    await dashboardDataSource.getRepository(DashboardPermission).save(dashboardPermissionData);

    const superadminQuery: AccountLoginRequest = {
      name: 'superadmin',
      password: process.env.SUPER_ADMIN_PASSWORD ?? 'secret',
    };

    const superadminResponse = await server.post('/account/login').send(superadminQuery);
    superadminLogin = superadminResponse.body;

    const readerQuery: AccountLoginRequest = {
      name: readerAccount.name,
      password: readerAccount.name,
    };

    const readerResponse = await server.post('/account/login').send(readerQuery);
    readerLogin = readerResponse.body;

    const authorQuery: AccountLoginRequest = {
      name: authorAccount.name,
      password: authorAccount.name,
    };

    const authorResponse = await server.post('/account/login').send(authorQuery);
    authorLogin = authorResponse.body;
  });

  describe('list', () => {
    it('no filters', async () => {
      const query: DashboardPermissionListRequest = {
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'create_time', order: 'ASC' }],
      };

      const response = await server
        .post('/dashboard_permission/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      response.body.data = response.body.data.map(omitTime);
      expect(response.body).toMatchObject({
        total: 5,
        offset: 0,
        data: [
          {
            id: response.body.data[0].id,
            owner_id: superadminLogin.account.id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: response.body.data[1].id,
            owner_id: superadminLogin.account.id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: response.body.data[2].id,
            owner_id: superadminLogin.account.id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: response.body.data[3].id,
            owner_id: superadminLogin.account.id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: response.body.data[4].id,
            owner_id: null,
            owner_type: null,
            access: [],
          },
        ],
      });

      dashboardId1 = response.body.data[0].id;
      dashboardId2 = response.body.data[1].id;
      dashboardId3 = response.body.data[2].id;
      dashboardId4 = response.body.data[3].id;
    });

    it('with filters', async () => {
      const query1: DashboardPermissionListRequest = {
        filter: { id: { isFuzzy: true, value: dashboardId1 } },
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'create_time', order: 'ASC' }],
      };

      const response1 = await server
        .post('/dashboard_permission/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query1);

      response1.body.data = response1.body.data.map(omitTime);
      expect(response1.body).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: dashboardId1,
            owner_id: superadminLogin.account.id,
            owner_type: 'ACCOUNT',
            access: [],
          },
        ],
      });

      const query2: DashboardPermissionListRequest = {
        filter: { owner_id: { isFuzzy: true, value: superadminLogin.account.id } },
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'create_time', order: 'ASC' }],
      };

      const response2 = await server
        .post('/dashboard_permission/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query2);

      response2.body.data = response2.body.data.map(omitTime);
      expect(response2.body).toMatchObject({
        total: 4,
        offset: 0,
        data: [
          {
            id: dashboardId1,
            owner_id: superadminLogin.account.id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: dashboardId2,
            owner_id: superadminLogin.account.id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: dashboardId3,
            owner_id: superadminLogin.account.id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: dashboardId4,
            owner_id: superadminLogin.account.id,
            owner_type: 'ACCOUNT',
            access: [],
          },
        ],
      });

      const query3: DashboardPermissionListRequest = {
        filter: { owner_type: { isFuzzy: false, value: 'APIKEY' } },
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'create_time', order: 'ASC' }],
      };

      const response3 = await server
        .post('/dashboard_permission/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query3);

      expect(response3.body).toMatchObject({
        total: 0,
        offset: 0,
        data: [],
      });
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const query1: DashboardPermissionUpdateRequest = {
        id: dashboardId1,
        access: [
          { type: 'ACCOUNT', id: readerAccount.id, permission: 'EDIT' },
          { type: 'APIKEY', id: authorApiKey.id, permission: 'EDIT' },
          { type: 'ACCOUNT', id: authorAccount.id, permission: 'VIEW' },
          { type: 'APIKEY', id: readerApiKey.id, permission: 'VIEW' },
        ],
      };

      const response1 = await server
        .post('/dashboard_permission/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query1);

      response1.body = omitTime(response1.body);
      expect(response1.body).toMatchObject({
        id: dashboardId1,
        owner_id: superadminLogin.account.id,
        owner_type: 'ACCOUNT',
        access: [
          { type: 'ACCOUNT', id: readerAccount.id, permission: 'EDIT' },
          { type: 'APIKEY', id: authorApiKey.id, permission: 'EDIT' },
          { type: 'ACCOUNT', id: authorAccount.id, permission: 'VIEW' },
          { type: 'APIKEY', id: readerApiKey.id, permission: 'VIEW' },
        ],
      });

      const query2: DashboardPermissionUpdateRequest = {
        id: dashboardId1,
        access: [
          { type: 'ACCOUNT', id: authorAccount.id, permission: 'REMOVE' },
          { type: 'APIKEY', id: readerApiKey.id, permission: 'REMOVE' },
        ],
      };

      const response2 = await server
        .post('/dashboard_permission/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query2);

      response2.body = omitTime(response2.body);
      expect(response2.body).toMatchObject({
        id: dashboardId1,
        owner_id: superadminLogin.account.id,
        owner_type: 'ACCOUNT',
        access: [
          { type: 'ACCOUNT', id: readerAccount.id, permission: 'EDIT' },
          { type: 'APIKEY', id: authorApiKey.id, permission: 'EDIT' },
        ],
      });

      const query3: DashboardPermissionUpdateRequest = {
        id: dashboardId2,
        access: [{ type: 'ACCOUNT', id: authorAccount.id, permission: 'VIEW' }],
      };

      const response3 = await server
        .post('/dashboard_permission/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query3);

      response3.body = omitTime(response3.body);
      expect(response3.body).toMatchObject({
        id: dashboardId2,
        owner_id: superadminLogin.account.id,
        owner_type: 'ACCOUNT',
        access: [{ type: 'ACCOUNT', id: authorAccount.id, permission: 'VIEW' }],
      });
    });

    it('should fail', async () => {
      const query1: DashboardPermissionUpdateRequest = {
        id: dashboardId2,
        access: [],
      };

      const response1 = await server
        .post('/dashboard_permission/update')
        .set('Authorization', `Bearer ${authorLogin.token}`)
        .send(query1);

      expect(response1.body).toMatchObject({
        code: 'FORBIDDEN',
        detail: { message: 'Insufficient privileges for this dashboard' },
      });

      const query2: DashboardPermissionUpdateRequest = {
        id: dashboardId5,
        access: [],
      };

      const response2 = await server
        .post('/dashboard_permission/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query2);

      expect(response2.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'Dashboard has no owner. Please assign a new owner before modifying permissions' },
      });
    });
  });

  describe('checkPermission', () => {
    it('should have permission', async () => {
      const query1: DashboardIDRequest = {
        id: dashboardId1,
      };
      const response1 = await server
        .post('/dashboard/details')
        .set('Authorization', `Bearer ${readerLogin.token}`)
        .send(query1);
      expect(response1.body.id).toEqual(dashboardId1);

      const query2: DashboardIDRequest = {
        id: dashboardId2,
      };
      const response2 = await server
        .post('/dashboard/details')
        .set('Authorization', `Bearer ${authorLogin.token}`)
        .send(query2);
      expect(response2.body.id).toEqual(dashboardId2);

      const query3: DashboardIDRequest = {
        id: dashboardId1,
      };
      const response3 = await server
        .post('/dashboard/details')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query3);
      expect(response3.body.id).toEqual(dashboardId1);

      const authentication = createAuthStruct(authorApiKey, {
        id: dashboardId1,
      });
      const query4: DashboardUpdateRequest = {
        id: dashboardId1,
        authentication,
      };
      const response4 = await server.put('/dashboard/update').send(query4);
      expect(response4.body.id).toEqual(dashboardId1);
    });

    it('should not have permission', async () => {
      const query1: DashboardIDRequest = {
        id: dashboardId1,
      };

      const response1 = await server
        .post('/dashboard/details')
        .set('Authorization', `Bearer ${authorLogin.token}`)
        .send(query1);
      expect(response1.body).toMatchObject({
        code: 'FORBIDDEN',
        detail: { message: 'Insufficient privileges for this dashboard' },
      });

      const query2: DashboardIDRequest = {
        id: dashboardId2,
      };

      const response2 = await server
        .put('/dashboard/update')
        .set('Authorization', `Bearer ${authorLogin.token}`)
        .send(query2);
      expect(response2.body).toMatchObject({
        code: 'FORBIDDEN',
        detail: { message: 'Insufficient privileges for this dashboard' },
      });
    });
  });

  describe('updateOwner', () => {
    it('should update successfully', async () => {
      const query1: DashboardOwnerUpdateRequest = {
        id: dashboardId1,
        owner_id: authorApiKey.id,
        owner_type: 'APIKEY',
      };
      const response1 = await server
        .post('/dashboard_permission/updateOwner')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query1);

      response1.body = omitTime(response1.body);
      expect(response1.body).toMatchObject({
        id: dashboardId1,
        owner_id: authorApiKey.id,
        owner_type: 'APIKEY',
        access: [{ id: readerAccount.id, type: 'ACCOUNT', permission: 'EDIT' }],
      });
    });

    it('should fail', async () => {
      const query1: DashboardOwnerUpdateRequest = {
        id: dashboardId2,
        owner_id: readerAccount.id,
        owner_type: 'ACCOUNT',
      };
      const response1 = await server
        .post('/dashboard_permission/updateOwner')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query1);
      expect(response1.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: {
          message: 'Resource has insufficient privileges to take dashboard ownership',
        },
      });
    });
  });
});
