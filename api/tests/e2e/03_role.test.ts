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
      {
        key: '[datasource]view',
        description: 'Allows viewing datasources',
      },
      {
        key: '[datasource]manage',
        description: 'Allows creating, editing, deleting datasources',
      },
      {
        key: '[dashboard]view',
        description: 'Allows viewing dashboards (including contents)',
      },
      {
        key: '[dashboard]manage',
        description: 'Allows creating, editing, deleting dashboards, and viewing changelogs',
      },
      { key: '[account]list', description: 'Allows viewing of accounts' },
      { key: '[account]login', description: 'Allows logging in' },
      {
        key: '[account]update',
        description: 'Allows updating own account',
      },
      {
        key: '[account]changepassword',
        description: 'Allows changing account password',
      },
      {
        key: '[account]manage',
        description: 'Allows creating, editing, deleting accounts',
      },
      { key: '[apikey]list', description: 'Allows viewing of ApiKeys' },
      {
        key: '[apikey]manage',
        description: 'Allows creating and deleting ApiKeys',
      },
      {
        key: '[role]manage',
        description: 'Allows creating, editing, deleting roles',
      },
      { key: '[config]set-lang', description: 'Allows updating lang' },
      {
        key: '[config]get-website_settings',
        description: 'Allows retrieving website settings',
      },
      {
        key: '[config]set-website_settings',
        description: 'Allows updating website settings',
      },
      {
        key: '[customfunction]view',
        description: 'Allows viewing custom functions',
      },
      {
        key: '[customfunction]manage',
        description: 'Allows creating, editing, deleting custom functions',
      },
      {
        key: '[sqlsnippet]view',
        description: 'Allows viewing sql snippets',
      },
      {
        key: '[sqlsnippet]manage',
        description: 'Allows creating, editing, deleting sql snippets',
      },
      {
        key: '[preset]',
        description: 'Allows modification of preset assets',
      },
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
