import { connectionHook } from './jest.util';
import request from 'supertest';
import { app } from '~/server';
import { FIXED_ROLE_PERMISSIONS, FIXED_ROLE_TYPES, HIDDEN_PERMISSIONS, PERMISSIONS } from '~/services/role.service';
import { AccountLoginRequest, AccountLoginResponse } from '~/api_models/account';
import { RoleCreateOrUpdateRequest, RoleIDRequest } from '~/api_models/role';

describe('RoleController', () => {
  connectionHook();
  let superadminLogin: AccountLoginResponse;

  const server = request(app);

  beforeAll(async () => {
    const query: AccountLoginRequest = {
      name: 'superadmin',
      password: process.env.SUPER_ADMIN_PASSWORD ?? 'secret',
    };

    const response = await server.post('/account/login').send(query);

    superadminLogin = response.body;
  });

  it('list', async () => {
    const response = await server.get('/role/list').send();

    expect(response.body).toMatchObject([
      {
        id: FIXED_ROLE_TYPES.INACTIVE,
        description: 'Disabled user. Can not login',
        permissions: [],
      },
      {
        id: FIXED_ROLE_TYPES.READER,
        description: 'Can view dashboards',
        permissions: FIXED_ROLE_PERMISSIONS.READER,
      },
      {
        id: FIXED_ROLE_TYPES.AUTHOR,
        description: 'Can view and create dashboards',
        permissions: FIXED_ROLE_PERMISSIONS.AUTHOR,
      },
      {
        id: FIXED_ROLE_TYPES.ADMIN,
        description:
          'Can view and create dashboards. Can add and delete datasources. Can add users except other admins',
        permissions: FIXED_ROLE_PERMISSIONS.ADMIN,
      },
      {
        id: FIXED_ROLE_TYPES.SUPERADMIN,
        description: 'Can do everything',
        permissions: FIXED_ROLE_PERMISSIONS.SUPERADMIN,
      },
    ]);
  });

  it('permissions', async () => {
    const response = await server.get('/role/permissions').send();

    expect(response.body).toMatchObject([
      PERMISSIONS.DATASOURCE_VIEW,
      PERMISSIONS.DATASOURCE_MANAGE,
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.DASHBOARD_MANAGE,
      PERMISSIONS.ACCOUNT_LIST,
      PERMISSIONS.ACCOUNT_LOGIN,
      PERMISSIONS.ACCOUNT_UPDATE,
      PERMISSIONS.ACCOUNT_CHANGEPASSWORD,
      PERMISSIONS.ACCOUNT_MANAGE,
      PERMISSIONS.APIKEY_LIST,
      PERMISSIONS.APIKEY_MANAGE,
      PERMISSIONS.ROLE_MANAGE,
      PERMISSIONS.CONFIG_SET_LANG,
      PERMISSIONS.CONFIG_GET_WEBSITE_SETTINGS,
      PERMISSIONS.CONFIG_SET_WEBSITE_SETTINGS,
      PERMISSIONS.CUSTOM_FUNCTION_VIEW,
      PERMISSIONS.CUSTOM_FUNCTION_MANAGE,
      HIDDEN_PERMISSIONS.PRESET,
    ]);
  });

  describe('createOrUpdate', () => {
    it('should create successfully', async () => {
      const request: RoleCreateOrUpdateRequest = {
        id: 'TEST',
        description: 'Test role',
        permissions: [PERMISSIONS.ACCOUNT_CHANGEPASSWORD],
      };

      const response = await server
        .post('/role/createOrUpdate')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body).toMatchObject({
        id: 'TEST',
        description: 'Test role',
        permissions: [PERMISSIONS.ACCOUNT_CHANGEPASSWORD],
      });
    });

    it('should update successfully', async () => {
      const request: RoleCreateOrUpdateRequest = {
        id: 'TEST',
        description: 'Test role',
        permissions: [PERMISSIONS.ACCOUNT_LIST],
      };

      const response = await server
        .post('/role/createOrUpdate')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body).toMatchObject({
        id: 'TEST',
        description: 'Test role',
        permissions: [PERMISSIONS.ACCOUNT_LIST],
      });
    });
  });

  it('delete', async () => {
    const request: RoleIDRequest = {
      id: 'TEST',
    };

    const response = await server
      .post('/role/delete')
      .set('Authorization', `Bearer ${superadminLogin.token}`)
      .send(request);

    expect(response.body).toMatchObject({ id: 'TEST' });
  });
});
