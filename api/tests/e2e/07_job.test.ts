import { connectionHook, sleep } from './jest.util';
import * as validation from '~/middleware/validation';
import { app } from '~/server';
import request from 'supertest';
import { AccountLoginRequest, AccountLoginResponse } from '~/api_models/account';
import Dashboard from '~/models/dashboard';
import DataSource from '~/models/datasource';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { parseDBUrl } from '../utils';
import { DataSourceCreateRequest, DataSourceRenameRequest } from '~/api_models/datasource';
import { DashboardCreateRequest, DashboardListRequest } from '~/api_models/dashboard';
import { JobListRequest, JobRunRequest } from '~/api_models/job';
import Job from '~/models/job';

describe('JobController', () => {
  connectionHook();
  let superadminLogin: AccountLoginResponse;
  let dashboard: Dashboard;
  let pgDatasource: DataSource;
  let httpDatasource: DataSource;

  const server = request(app);

  const validate = jest.spyOn(validation, 'validate');

  beforeAll(async () => {
    const query: AccountLoginRequest = {
      name: 'superadmin',
      password: process.env.SUPER_ADMIN_PASSWORD ?? 'secret',
    };
    validate.mockReturnValueOnce(query);

    const response = await server.post('/account/login').send(query);

    superadminLogin = response.body;

    const dashboardQuery: DashboardCreateRequest = {
      name: 'jobDashboard',
      content: {
        definition: {
          queries: [
            {
              id: 'pgQuery',
              type: 'postgresql',
              key: 'jobPG',
            },
            {
              id: 'httpQuery',
              type: 'http',
              key: 'jobHTTP',
            },
          ],
        },
      },
      group: 'job',
    };
    validate.mockReturnValueOnce(dashboardQuery);

    const dashboardResponse = await server
      .post('/dashboard/create')
      .set('Authorization', `Bearer ${superadminLogin.token}`)
      .send(dashboardQuery);

    dashboard = dashboardResponse.body;

    const connectionString = process.env.END_2_END_TEST_PG_URL;
    const { username, password, host, port, database } = parseDBUrl(connectionString);
    const pgQuery: DataSourceCreateRequest = {
      type: 'postgresql',
      key: 'jobPG',
      config: {
        host,
        username,
        password,
        database,
        port,
      },
    };
    validate.mockReturnValueOnce(pgQuery);

    const pgResponse = await server
      .post('/datasource/create')
      .set('Authorization', `Bearer ${superadminLogin.token}`)
      .send(pgQuery);

    pgDatasource = pgResponse.body;

    const httpQuery: DataSourceCreateRequest = {
      type: 'http',
      key: 'jobHTTP',
      config: {
        host: 'http://jsonplaceholder.typicode.com',
        processing: {
          pre: '',
          post: '',
        },
      },
    };
    validate.mockReturnValueOnce(httpQuery);

    const httpResponse = await server
      .post('/datasource/create')
      .set('Authorization', `Bearer ${superadminLogin.token}`)
      .send(httpQuery);

    httpDatasource = httpResponse.body;
  });

  beforeEach(() => {
    validate.mockReset();
  });

  describe('rename', () => {
    it('rename jobPG', async () => {
      const query: DataSourceRenameRequest = {
        id: pgDatasource.id,
        key: pgDatasource.key + '_renamed',
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .put('/datasource/rename')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        type: 'RENAME_DATASOURCE',
        status: 'INIT',
        params: {
          type: 'postgresql',
          old_key: pgDatasource.key,
          new_key: pgDatasource.key + '_renamed',
        },
        id: response.body.id,
        create_time: response.body.create_time,
        update_time: response.body.update_time,
      });
      pgDatasource.key = pgDatasource.key + '_renamed';

      await sleep(2000);
    });

    it('rename jobHTTP', async () => {
      const query: DataSourceRenameRequest = {
        id: httpDatasource.id,
        key: httpDatasource.key + '_renamed',
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .put('/datasource/rename')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        type: 'RENAME_DATASOURCE',
        status: 'INIT',
        params: {
          type: 'http',
          old_key: httpDatasource.key,
          new_key: httpDatasource.key + '_renamed',
        },
        id: response.body.id,
        create_time: response.body.create_time,
        update_time: response.body.update_time,
      });
      httpDatasource.key = httpDatasource.key + '_renamed';
      await sleep(2000);
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const query: JobListRequest = {
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'create_time', order: 'ASC' }],
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .post('/job/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: response.body.data[0].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'http',
              new_key: 'jsonplaceholder_renamed',
              old_key: 'jsonplaceholder',
            },
            result: { affected_dashboards: [] },
            create_time: response.body.data[0].create_time,
            update_time: response.body.data[0].update_time,
          },
          {
            id: response.body.data[1].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'postgresql',
              new_key: 'jobPG_renamed',
              old_key: 'jobPG',
            },
            result: {
              affected_dashboards: [
                {
                  queries: ['pgQuery'],
                  dashboardId: dashboard.id,
                },
              ],
            },
            create_time: response.body.data[1].create_time,
            update_time: response.body.data[1].update_time,
          },
          {
            id: response.body.data[2].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'http',
              new_key: 'jobHTTP_renamed',
              old_key: 'jobHTTP',
            },
            result: {
              affected_dashboards: [
                {
                  queries: ['httpQuery'],
                  dashboardId: dashboard.id,
                },
              ],
            },
            create_time: response.body.data[2].create_time,
            update_time: response.body.data[2].update_time,
          },
        ],
      });
    });
  });

  describe('check Dashboard', () => {
    it('dashboard content queries should be updated', async () => {
      const query: DashboardListRequest = {
        filter: {
          name: { value: 'jobDashboard', isFuzzy: true },
          group: { value: '', isFuzzy: true },
          is_removed: false,
        },
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'name', order: 'ASC' }],
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .post('/dashboard/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: response.body.data[0].id,
            name: 'jobDashboard',
            content: {
              definition: {
                queries: [
                  {
                    id: 'pgQuery',
                    type: 'postgresql',
                    key: 'jobPG_renamed',
                  },
                  {
                    id: 'httpQuery',
                    type: 'http',
                    key: 'jobHTTP_renamed',
                  },
                ],
              },
            },
            create_time: response.body.data[0].create_time,
            update_time: response.body.data[0].update_time,
            is_removed: false,
            is_preset: false,
            group: 'job',
          },
        ],
      });
    });
  });

  describe('manually run job', () => {
    it('add jobs', async () => {
      const jobRepo = dashboardDataSource.getRepository(Job);
      const job1 = new Job();
      job1.type = 'RENAME_DATASOURCE';
      job1.status = 'INIT';
      job1.params = {
        type: 'postgresql',
        new_key: 'jobPG_renamed',
        old_key: 'jobPG',
      };
      await jobRepo.save(job1);

      const job2 = new Job();
      job2.type = 'RENAME_DATASOURCE';
      job2.status = 'INIT';
      job2.params = {
        type: 'postgresql',
        new_key: 'jobPG',
        old_key: 'jobPG_renamed',
      };
      await jobRepo.save(job2);
    });

    it('run jobs', async () => {
      const query: JobRunRequest = {
        type: 'RENAME_DATASOURCE',
      };
      validate.mockReturnValueOnce(query);

      await server.post('/job/run').set('Authorization', `Bearer ${superadminLogin.token}`).send(query);

      await sleep(2000);
    });

    it('list jobs', async () => {
      const query: JobListRequest = {
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'create_time', order: 'ASC' }],
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .post('/job/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        total: 5,
        offset: 0,
        data: [
          {
            id: response.body.data[0].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'http',
              new_key: 'jsonplaceholder_renamed',
              old_key: 'jsonplaceholder',
            },
            result: { affected_dashboards: [] },
            create_time: response.body.data[0].create_time,
            update_time: response.body.data[0].update_time,
          },
          {
            id: response.body.data[1].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'postgresql',
              new_key: 'jobPG_renamed',
              old_key: 'jobPG',
            },
            result: {
              affected_dashboards: [
                {
                  queries: ['pgQuery'],
                  dashboardId: dashboard.id,
                },
              ],
            },
            create_time: response.body.data[1].create_time,
            update_time: response.body.data[1].update_time,
          },
          {
            id: response.body.data[2].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'http',
              new_key: 'jobHTTP_renamed',
              old_key: 'jobHTTP',
            },
            result: {
              affected_dashboards: [
                {
                  queries: ['httpQuery'],
                  dashboardId: dashboard.id,
                },
              ],
            },
            create_time: response.body.data[2].create_time,
            update_time: response.body.data[2].update_time,
          },
          {
            id: response.body.data[3].id,
            type: 'RENAME_DATASOURCE',
            status: 'FAILED',
            params: {
              type: 'postgresql',
              new_key: 'jobPG_renamed',
              old_key: 'jobPG',
            },
            result: response.body.data[3].result,
            create_time: response.body.data[3].create_time,
            update_time: response.body.data[3].update_time,
          },
          {
            id: response.body.data[4].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'postgresql',
              new_key: 'jobPG',
              old_key: 'jobPG_renamed',
            },
            result: {
              affected_dashboards: [
                {
                  queries: ['pgQuery'],
                  dashboardId: dashboard.id,
                },
              ],
            },
            create_time: response.body.data[4].create_time,
            update_time: response.body.data[4].update_time,
          },
        ],
      });
    });
  });
});
