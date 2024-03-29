import { connectionHook } from './jest.util';
import request from 'supertest';
import { app } from '~/server';
import { FIXED_ROLE_PERMISSIONS, FIXED_ROLE_TYPES, PERMISSIONS } from '~/services/role.service';
import { AccountLoginRequest, AccountLoginResponse } from '~/api_models/account';
import { RoleCreateOrUpdateRequest, RoleIDRequest } from '~/api_models/role';
import { notFoundId } from './constants';

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
        key: '[config]set-website_settings',
        description: 'Allows updating website settings',
      },
      {
        key: '[config]set-query_cache_enabled',
        description: 'Allows updating the query cache enabled status',
      },
      {
        key: '[config]set-query_cache_expire_time',
        description: 'Allows updating the query cache expire time',
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

  describe('create', () => {
    it('should create successfully', async () => {
      const req: RoleCreateOrUpdateRequest = {
        id: 'TEST',
        description: 'Test role',
        permissions: [PERMISSIONS.ACCOUNT_CHANGEPASSWORD],
      };

      const response = await server
        .post('/role/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(req);

      expect(response.body).toMatchObject({
        id: 'TEST',
        description: 'Test role',
        permissions: [PERMISSIONS.ACCOUNT_CHANGEPASSWORD],
      });
    });

    it('should fail if duplicate', async () => {
      const req: RoleCreateOrUpdateRequest = {
        id: 'TEST',
        description: 'Test role',
        permissions: [PERMISSIONS.ACCOUNT_CHANGEPASSWORD],
      };

      const response = await server
        .post('/role/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(req);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: {
          message: 'Role already exists',
        },
      });
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const req: RoleCreateOrUpdateRequest = {
        id: 'TEST',
        description: 'Test role',
        permissions: [PERMISSIONS.ACCOUNT_LIST],
      };

      const response = await server
        .put('/role/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(req);

      expect(response.body).toMatchObject({
        id: 'TEST',
        description: 'Test role',
        permissions: [PERMISSIONS.ACCOUNT_LIST],
      });
    });

    it('should fail if not found', async () => {
      const req: RoleCreateOrUpdateRequest = {
        id: notFoundId,
        description: 'non-existant role',
        permissions: [],
      };

      const response = await server
        .put('/role/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(req);

      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.detail.message).toContain('Could not find any entity of type "Role" matching');
      expect(response.body.detail.message).toContain(notFoundId);
    });
  });

  it('delete', async () => {
    const req: RoleIDRequest = {
      id: 'TEST',
    };

    const response = await server
      .post('/role/delete')
      .set('Authorization', `Bearer ${superadminLogin.token}`)
      .send(req);

    expect(response.body).toMatchObject({ id: 'TEST' });
  });
});
