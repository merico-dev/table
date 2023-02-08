import { connectionHook } from './jest.util';
import * as validation from '~/middleware/validation';
import { app } from '~/server';
import request from 'supertest';
import { AccountLoginRequest, AccountLoginResponse } from '~/api_models/account';
import { DashboardChangelogListRequest } from '~/api_models/dashboard_changelog';

describe('DashboardChangelogController', () => {
  connectionHook();
  let superadminLogin: AccountLoginResponse;
  let changelogDashboardId: string;

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
  });

  beforeEach(() => {
    validate.mockReset();
  });

  describe('list', () => {
    it('no filters', async () => {
      const query: DashboardChangelogListRequest = {
        pagination: { page: 1, pagesize: 20 },
        sort: { field: 'create_time', order: 'ASC' },
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .post('/dashboard_changelog/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        total: 7,
        offset: 0,
        data: [
          {
            id: response.body.data[0].id,
            dashboard_id: response.body.data[0].dashboard_id,
            diff: response.body.data[0].diff,
            create_time: response.body.data[0].create_time,
          },
          {
            id: response.body.data[1].id,
            dashboard_id: response.body.data[1].dashboard_id,
            diff: response.body.data[1].diff,
            create_time: response.body.data[1].create_time,
          },
          {
            id: response.body.data[2].id,
            dashboard_id: response.body.data[2].dashboard_id,
            diff: response.body.data[2].diff,
            create_time: response.body.data[2].create_time,
          },
          {
            id: response.body.data[3].id,
            dashboard_id: response.body.data[3].dashboard_id,
            diff: response.body.data[3].diff,
            create_time: response.body.data[3].create_time,
          },
          {
            id: response.body.data[4].id,
            dashboard_id: response.body.data[4].dashboard_id,
            diff: response.body.data[4].diff,
            create_time: response.body.data[4].create_time,
          },
          {
            id: response.body.data[5].id,
            dashboard_id: response.body.data[5].dashboard_id,
            diff: response.body.data[5].diff,
            create_time: response.body.data[5].create_time,
          },
          {
            id: response.body.data[6].id,
            dashboard_id: response.body.data[6].dashboard_id,
            diff: response.body.data[6].diff,
            create_time: response.body.data[6].create_time,
          },
        ],
      });

      expect(response.body.data[0].diff).toContain('diff --git a/data.json b/data.json');
      expect(response.body.data[0].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(response.body.data[0].diff).toContain('@@ -2,9 +2,11 @@');
      expect(response.body.data[0].diff).toContain(
        '-\t"name": "dashboard2",\n' +
          '-\t"content": {},\n' +
          '-\t"is_removed": false,\n' +
          '+\t"name": "dashboard2_updated",\n' +
          '+\t"content": {\n' +
          '+\t\t"tmp": "tmp"\n' +
          '+\t},\n' +
          '+\t"is_removed": true,\n' +
          ' \t"is_preset": false,\n' +
          '-\t"group": "2"\n' +
          '+\t"group": "2_updated"\n' +
          ' }\n',
      );

      expect(response.body.data[1].diff).toContain('diff --git a/data.json b/data.json');
      expect(response.body.data[1].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(response.body.data[1].diff).toContain('@@ -2,9 +2,11 @@');
      expect(response.body.data[1].diff).toContain(
        '-\t"name": "preset",\n' +
          '-\t"content": {},\n' +
          '-\t"is_removed": true,\n' +
          '+\t"name": "preset_updated",\n' +
          '+\t"content": {\n' +
          '+\t\t"tmp": "tmp"\n' +
          '+\t},\n' +
          '+\t"is_removed": false,\n' +
          ' \t"is_preset": true,\n' +
          '-\t"group": ""\n' +
          '+\t"group": "preset"\n' +
          ' }\n',
      );

      expect(response.body.data[2].diff).toContain('diff --git a/data.json b/data.json');
      expect(response.body.data[2].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(response.body.data[2].diff).toContain('@@ -4,7 +4,7 @@');
      expect(response.body.data[2].diff).toContain(
        ' \t"name": "dashboard1",\n' +
          ' \t"content": {},\n' +
          '-\t"is_removed": false,\n' +
          '+\t"is_removed": true,\n' +
          ' \t"is_preset": false,\n' +
          ' \t"group": "1"\n' +
          ' }\n',
      );

      expect(response.body.data[3].diff).toContain('diff --git a/data.json b/data.json');
      expect(response.body.data[3].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(response.body.data[3].diff).toContain('@@ -6,7 +6,7 @@');
      expect(response.body.data[3].diff).toContain(
        ' \t"content": {\n' +
          ' \t\t"tmp": "tmp"\n' +
          ' \t},\n' +
          '-\t"is_removed": false,\n' +
          '+\t"is_removed": true,\n' +
          ' \t"is_preset": true,\n' +
          ' \t"group": "preset"\n' +
          ' }\n',
      );

      expect(response.body.data[4].diff).toContain('diff --git a/data.json b/data.json');
      expect(response.body.data[4].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(response.body.data[4].diff).toContain('@@ -6,7 +6,7 @@');
      expect(response.body.data[4].diff).toContain(
        ' \t\t\t"queries": [\n' +
          ' \t\t\t\t{\n' +
          ' \t\t\t\t\t"id": "pgQuery",\n' +
          '-\t\t\t\t\t"key": "jobPG",\n' +
          '+\t\t\t\t\t"key": "jobPG_renamed",\n' +
          ' \t\t\t\t\t"type": "postgresql"\n' +
          ' \t\t\t\t},\n' +
          ' \t\t\t\t{\n',
      );

      expect(response.body.data[5].diff).toContain('diff --git a/data.json b/data.json');
      expect(response.body.data[5].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(response.body.data[5].diff).toContain('@@ -11,7 +11,7 @@');
      expect(response.body.data[5].diff).toContain(
        ' \t\t\t\t},\n' +
          ' \t\t\t\t{\n' +
          ' \t\t\t\t\t"id": "httpQuery",\n' +
          '-\t\t\t\t\t"key": "jobHTTP",\n' +
          '+\t\t\t\t\t"key": "jobHTTP_renamed",\n' +
          ' \t\t\t\t\t"type": "http"\n' +
          ' \t\t\t\t}\n' +
          ' \t\t\t]\n',
      );

      expect(response.body.data[6].diff).toContain('diff --git a/data.json b/data.json');
      expect(response.body.data[6].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(response.body.data[6].diff).toContain('@@ -6,7 +6,7 @@');
      expect(response.body.data[6].diff).toContain(
        ' \t\t\t"queries": [\n' +
          ' \t\t\t\t{\n' +
          ' \t\t\t\t\t"id": "pgQuery",\n' +
          '-\t\t\t\t\t"key": "jobPG_renamed",\n' +
          '+\t\t\t\t\t"key": "jobPG",\n' +
          ' \t\t\t\t\t"type": "postgresql"\n' +
          ' \t\t\t\t},\n' +
          ' \t\t\t\t{\n',
      );

      changelogDashboardId = response.body.data[0].dashboard_id;
    });

    it('with search filters', async () => {
      const query: DashboardChangelogListRequest = {
        filter: { search: changelogDashboardId },
        pagination: { page: 1, pagesize: 20 },
        sort: { field: 'create_time', order: 'ASC' },
      };
      validate.mockReturnValueOnce(query);

      const response = await server
        .post('/dashboard_changelog/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: response.body.data[0].id,
            dashboard_id: response.body.data[0].dashboard_id,
            diff: response.body.data[0].diff,
            create_time: response.body.data[0].create_time,
          },
        ],
      });
      expect(response.body.data[0].diff).toContain('diff --git a/data.json b/data.json');
      expect(response.body.data[0].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(response.body.data[0].diff).toContain('@@ -2,9 +2,11 @@');
      expect(response.body.data[0].diff).toContain(
        '-\t"name": "dashboard2",\n' +
          '-\t"content": {},\n' +
          '-\t"is_removed": false,\n' +
          '+\t"name": "dashboard2_updated",\n' +
          '+\t"content": {\n' +
          '+\t\t"tmp": "tmp"\n' +
          '+\t},\n' +
          '+\t"is_removed": true,\n' +
          ' \t"is_preset": false,\n' +
          '-\t"group": "2"\n' +
          '+\t"group": "2_updated"\n' +
          ' }\n',
      );
    });
  });
});
