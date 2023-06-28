import { connectionHook, createAuthStruct } from './jest.util';
import Dashboard from '~/models/dashboard';
import DashboardContent from '~/models/dashboard_content';
import { dashboardDataSource } from '~/data_sources/dashboard';
import request from 'supertest';
import { app } from '~/server';
import { DashboardIDRequest, DashboardUpdateRequest } from '~/api_models/dashboard';
import { AccountLoginRequest, AccountLoginResponse } from '~/api_models/account';
import { notFoundId } from './constants';
import ApiKey from '~/models/apiKey';
import DashboardPermission from '~/models/dashboard_permission';
import {
  DashboardContentCreateRequest,
  DashboardContentListRequest,
  DashboardContentIDRequest,
  DashboardContentUpdateRequest,
} from '~/api_models/dashboard_content';
import { omitFields } from '~/utils/helpers';

describe('DashboardContentController', () => {
  connectionHook();
  let presetDashboard: Dashboard;
  let presetDashboardContent1: DashboardContent;
  let presetDashboardContent2: DashboardContent;
  let superadminLogin: AccountLoginResponse;
  let dashboard1: Dashboard;
  let dashboard1Content1: DashboardContent;
  let dashboard1Content2: DashboardContent;
  let dashboard2: Dashboard;
  let dashboard2Content1: DashboardContent;
  let dashboard2Content2: DashboardContent;
  let apiKey: ApiKey;
  const server = request(app);

  beforeAll(async () => {
    const query: AccountLoginRequest = {
      name: 'superadmin',
      password: process.env.SUPER_ADMIN_PASSWORD ?? 'secret',
    };

    const response = await server.post('/account/login').send(query);

    superadminLogin = response.body;

    const presetData = new Dashboard();
    presetData.name = 'preset';
    presetData.is_preset = true;
    presetData.is_removed = true;
    presetData.group = 'dashboard_content';
    presetDashboard = await dashboardDataSource.getRepository(Dashboard).save(presetData);

    const presetDashboardPermission = new DashboardPermission();
    presetDashboardPermission.id = presetDashboard.id;
    presetDashboardPermission.owner_id = superadminLogin.account.id;
    presetDashboardPermission.owner_type = 'ACCOUNT';
    await dashboardDataSource.getRepository(DashboardPermission).save(presetDashboardPermission);

    const presetContent1Data = new DashboardContent();
    presetContent1Data.dashboard_id = presetDashboard.id;
    presetContent1Data.name = 'presetContent1';
    presetContent1Data.content = {};
    presetDashboardContent1 = await dashboardDataSource.getRepository(DashboardContent).save(presetContent1Data);

    const presetContent2Data = new DashboardContent();
    presetContent2Data.dashboard_id = presetDashboard.id;
    presetContent2Data.name = 'presetContent2';
    presetContent2Data.content = {};
    presetDashboardContent2 = await dashboardDataSource.getRepository(DashboardContent).save(presetContent2Data);

    const dashboard1Data = new Dashboard();
    dashboard1Data.name = 'content_dashboard1';
    dashboard1Data.group = 'dashboard_content';
    dashboard1 = await dashboardDataSource.getRepository(Dashboard).save(dashboard1Data);

    const dashboard1Permission = new DashboardPermission();
    dashboard1Permission.id = dashboard1Data.id;
    dashboard1Permission.owner_id = superadminLogin.account.id;
    dashboard1Permission.owner_type = 'ACCOUNT';
    await dashboardDataSource.getRepository(DashboardPermission).save(dashboard1Permission);

    const dashboard2Data = new Dashboard();
    dashboard2Data.name = 'content_dashboard2';
    dashboard2Data.group = 'dashboard_content';
    dashboard2 = await dashboardDataSource.getRepository(Dashboard).save(dashboard2Data);

    const dashboard2Permission = new DashboardPermission();
    dashboard2Permission.id = dashboard2Data.id;
    dashboard2Permission.owner_id = superadminLogin.account.id;
    dashboard2Permission.owner_type = 'ACCOUNT';
    await dashboardDataSource.getRepository(DashboardPermission).save(dashboard2Permission);

    apiKey = await dashboardDataSource.getRepository(ApiKey).findOneBy({ name: 'key1' });
  });

  describe('create', () => {
    it('should create successfully', async () => {
      const request1: DashboardContentCreateRequest = {
        dashboard_id: dashboard1.id,
        name: 'dashboard1_content1',
        content: {},
      };

      const response1 = await server
        .post('/dashboard_content/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request1);

      response1.body = omitFields(response1.body, ['create_time', 'update_time']);
      dashboard1Content1 = response1.body;
      expect(response1.body).toMatchObject({
        id: response1.body.id,
        dashboard_id: dashboard1.id,
        name: 'dashboard1_content1',
        content: {},
      });

      const request2: DashboardContentCreateRequest = {
        dashboard_id: dashboard1.id,
        name: 'dashboard1_content2',
        content: {},
      };

      const response2 = await server
        .post('/dashboard_content/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request2);

      response2.body = omitFields(response2.body, ['create_time', 'update_time']);
      dashboard1Content2 = response2.body;
      expect(response2.body).toMatchObject({
        id: response2.body.id,
        dashboard_id: dashboard1.id,
        name: 'dashboard1_content2',
        content: {},
      });

      const request3: DashboardContentCreateRequest = {
        dashboard_id: dashboard2.id,
        name: 'dashboard2_content1',
        content: {},
      };

      const response3 = await server
        .post('/dashboard_content/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request3);

      response3.body = omitFields(response3.body, ['create_time', 'update_time']);
      dashboard2Content1 = response3.body;
      expect(response3.body).toMatchObject({
        id: response3.body.id,
        dashboard_id: dashboard2.id,
        name: 'dashboard2_content1',
        content: {},
      });

      const request4: DashboardContentCreateRequest = {
        dashboard_id: dashboard2.id,
        name: 'dashboard2_content2',
        content: {},
      };

      const response4 = await server
        .post('/dashboard_content/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request4);

      response4.body = omitFields(response4.body, ['create_time', 'update_time']);
      dashboard2Content2 = response4.body;
      expect(response4.body).toMatchObject({
        id: response4.body.id,
        dashboard_id: dashboard2.id,
        name: 'dashboard2_content2',
        content: {},
      });
    });

    it('should fail if duplicate name', async () => {
      const request: DashboardContentCreateRequest = {
        dashboard_id: dashboard1.id,
        name: 'dashboard1_content1',
        content: {},
      };

      const response = await server
        .post('/dashboard_content/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: {
          message: 'A dashboard content with that name already exists',
        },
      });
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const query1: DashboardContentListRequest = {
        dashboard_id: dashboard1.id,
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'name', order: 'ASC' }],
      };

      const response1 = await server
        .post('/dashboard_content/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query1);

      response1.body.data = response1.body.data.map((el) => omitFields(el, ['create_time', 'update_time']));
      expect(response1.body).toMatchObject({
        total: 2,
        offset: 0,
        data: [
          {
            id: response1.body.data[0].id,
            dashboard_id: dashboard1.id,
            name: 'dashboard1_content1',
            content: {},
          },
          {
            id: response1.body.data[1].id,
            dashboard_id: dashboard1.id,
            name: 'dashboard1_content2',
            content: {},
          },
        ],
      });

      const query2: DashboardContentListRequest = {
        dashboard_id: dashboard2.id,
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'name', order: 'ASC' }],
      };

      const response2 = await server
        .post('/dashboard_content/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query2);

      response2.body.data = response2.body.data.map((el) => omitFields(el, ['create_time', 'update_time']));
      expect(response2.body).toMatchObject({
        total: 2,
        offset: 0,
        data: [
          {
            id: response2.body.data[0].id,
            dashboard_id: dashboard2.id,
            name: 'dashboard2_content1',
            content: {},
          },
          {
            id: response2.body.data[1].id,
            dashboard_id: dashboard2.id,
            name: 'dashboard2_content2',
            content: {},
          },
        ],
      });
    });

    it('with filters', async () => {
      const query: DashboardContentListRequest = {
        dashboard_id: dashboard1.id,
        filter: { name: { value: 'dashboard1_content1', isFuzzy: true } },
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'name', order: 'ASC' }],
      };

      const response = await server
        .post('/dashboard_content/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      response.body.data = response.body.data.map((el) => omitFields(el, ['create_time', 'update_time']));
      expect(response.body).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: response.body.data[0].id,
            dashboard_id: dashboard1.id,
            name: 'dashboard1_content1',
            content: {},
          },
        ],
      });
    });
  });

  describe('details', () => {
    it('should return successfully', async () => {
      const query: DashboardContentIDRequest = {
        id: dashboard1Content1.id,
      };

      const response = await server
        .post('/dashboard_content/details')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      response.body = omitFields(response.body, ['create_time', 'update_time']);
      expect(response.body).toMatchObject(dashboard1Content1);
    });

    it('should fail', async () => {
      const query: DashboardIDRequest = {
        id: notFoundId,
      };

      const response = await server
        .post('/dashboard_content/details')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.detail.message).toContain('Could not find any entity of type "DashboardContent" matching');
      expect(response.body.detail.message).toContain(notFoundId);
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const query1: DashboardContentUpdateRequest = {
        id: dashboard1Content1.id,
        name: 'dashboard1_content1_updated',
        content: { tmp: 'tmp' },
      };

      const response1 = await server
        .put('/dashboard_content/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query1);

      response1.body = omitFields(response1.body, ['create_time', 'update_time']);
      expect(response1.body).toMatchObject({
        ...dashboard1Content1,
        name: 'dashboard1_content1_updated',
      });

      const query2: DashboardContentUpdateRequest = {
        id: dashboard2Content1.id,
        name: 'dashboard2_content1_updated',
        content: { tmp: 'tmp' },
      };

      const response2 = await server
        .put('/dashboard_content/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query2);

      response2.body = omitFields(response2.body, ['create_time', 'update_time']);
      expect(response2.body).toMatchObject({
        ...dashboard2Content1,
        name: 'dashboard2_content1_updated',
      });

      const query3: DashboardContentUpdateRequest = {
        id: dashboard2Content2.id,
        name: 'dashboard2_content2_updated',
        content: { tmp: 'tmp' },
      };

      const response3 = await server
        .put('/dashboard_content/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query3);

      response3.body = omitFields(response3.body, ['create_time', 'update_time']);
      expect(response3.body).toMatchObject({
        ...dashboard2Content2,
        name: 'dashboard2_content2_updated',
      });

      const query4: DashboardContentUpdateRequest = {
        id: dashboard1Content2.id,
        name: 'dashboard1_content2_updated',
        content: { tmp: 'tmp1' },
      };

      const response4 = await server
        .put('/dashboard_content/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query4);

      response4.body = omitFields(response4.body, ['create_time', 'update_time']);
      expect(response4.body).toMatchObject({
        ...dashboard1Content2,
        name: 'dashboard1_content2_updated',
      });
    });

    it('should fail if not found', async () => {
      const query: DashboardContentUpdateRequest = {
        id: notFoundId,
        name: 'not_found',
      };

      const response = await server
        .put('/dashboard_content/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.detail.message).toContain('Could not find any entity of type "DashboardContent" matching');
      expect(response.body.detail.message).toContain(notFoundId);
    });

    it('should update preset dashboard successfully', async () => {
      const query: DashboardContentUpdateRequest = {
        id: presetDashboardContent1.id,
        name: 'presetContent1_updated',
        content: { tmp: 'tmp' },
      };

      const response = await server
        .put('/dashboard_content/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      response.body = omitFields(response.body, ['create_time', 'update_time']);
      expect(response.body).toMatchObject({
        ...omitFields(presetDashboardContent1, ['create_time', 'update_time']),
        name: 'presetContent1_updated',
        content: { tmp: 'tmp' },
      });
    });

    it('should fail if not SUPERADMIN', async () => {
      const authentication = createAuthStruct(apiKey, {
        id: presetDashboardContent1.id,
        name: 'presetContent1_updated',
      });

      const query: DashboardUpdateRequest = {
        id: presetDashboardContent1.id,
        name: 'presetContent1_updated',
        authentication,
      };

      const response = await server.put('/dashboard_content/update').send(query);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: '只有超级管理员才能编辑预设报表内容' },
      });
    });
  });

  describe('Dashboard update content_id', () => {
    it('should update successfully', async () => {
      const query1: DashboardUpdateRequest = {
        id: dashboard1.id,
        content_id: dashboard1Content1.id,
      };

      const response1 = await server
        .put('/dashboard/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query1);

      response1.body = omitFields(response1.body, ['create_time', 'update_time']);
      expect(response1.body).toMatchObject({
        ...omitFields(dashboard1, ['create_time', 'update_time']),
        content_id: dashboard1Content1.id,
      });

      const query2: DashboardUpdateRequest = {
        id: dashboard2.id,
        content_id: dashboard2Content1.id,
      };

      const response2 = await server
        .put('/dashboard/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query2);

      response2.body = omitFields(response2.body, ['create_time', 'update_time']);
      expect(response2.body).toMatchObject({
        ...omitFields(dashboard2, ['create_time', 'update_time']),
        content_id: dashboard2Content1.id,
      });
    });

    it('should fail if not found', async () => {
      const query: DashboardUpdateRequest = {
        id: dashboard1.id,
        content_id: notFoundId,
      };

      const response = await server
        .put('/dashboard/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'That dashboard content does not exist' },
      });
    });
  });

  describe('delete', () => {
    it('should delete successfully', async () => {
      const query1: DashboardContentIDRequest = {
        id: dashboard1Content1.id,
      };

      const response1 = await server
        .post('/dashboard_content/delete')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query1);

      expect(response1.body).toMatchObject({ id: dashboard1Content1.id });

      const query2: DashboardIDRequest = {
        id: dashboard1.id,
      };

      const response2 = await server
        .post('/dashboard/details')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query2);

      response2.body = omitFields(response2.body, ['create_time', 'update_time']);
      expect(response2.body).toMatchObject({
        ...omitFields(dashboard1, ['create_time', 'update_time']),
        content_id: null,
      });
    });

    it('deleting dashboard should also delete all content', async () => {
      const query1: DashboardContentListRequest = {
        dashboard_id: dashboard2.id,
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'name', order: 'ASC' }],
      };

      const response1 = await server
        .post('/dashboard_content/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query1);

      response1.body.data = response1.body.data.map((el) => omitFields(el, ['create_time', 'update_time']));
      expect(response1.body).toMatchObject({
        total: 2,
        offset: 0,
        data: [
          {
            id: response1.body.data[0].id,
            dashboard_id: dashboard2.id,
            name: 'dashboard2_content1_updated',
            content: {},
          },
          {
            id: response1.body.data[1].id,
            dashboard_id: dashboard2.id,
            name: 'dashboard2_content2_updated',
            content: {},
          },
        ],
      });

      await dashboardDataSource.manager.getRepository(Dashboard).delete(dashboard2.id);

      const response2 = await server
        .post('/dashboard_content/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query1);

      expect(response2.body.code).toEqual('NOT_FOUND');
      expect(response2.body.detail.message).toContain(
        'Could not find any entity of type "DashboardPermission" matching',
      );
    });

    it('should fail if not found', async () => {
      const query: DashboardContentIDRequest = {
        id: notFoundId,
      };

      const response = await server
        .post('/dashboard_content/delete')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.detail.message).toContain('Could not find any entity of type "DashboardContent" matching');
      expect(response.body.detail.message).toContain(notFoundId);
    });

    it('should delete preset dashboard content successfully if SUPERADMIN', async () => {
      const query: DashboardContentIDRequest = {
        id: presetDashboardContent1.id,
      };

      const response = await server
        .post('/dashboard_content/delete')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({ id: presetDashboardContent1.id });
    });

    it('should fail to delete preset dashboard content if not SUPERADMIN', async () => {
      const authentication = createAuthStruct(apiKey, { id: presetDashboardContent2.id });

      const query: DashboardContentIDRequest = {
        id: presetDashboardContent2.id,
        authentication,
      };

      const response = await server.post('/dashboard_content/delete').send(query);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: '只有超级管理员才能删除预设报表内容' },
      });
    });
  });
});
