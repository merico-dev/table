import { connectionHook } from './jest.util';
import { app } from '~/server';
import request from 'supertest';
import { AccountLoginRequest, AccountLoginResponse } from '~/api_models/account';
import { DashboardContentChangelogListRequest } from '~/api_models/dashboard_content_changelog';
import { omitTime } from '~/utils/helpers';

describe('DashboardChangelogController', () => {
  connectionHook();
  let superadminLogin: AccountLoginResponse;
  let changelogDashboardContentId: string;

  const server = request(app);

  beforeAll(async () => {
    const query: AccountLoginRequest = {
      name: 'superadmin',
      password: process.env.SUPER_ADMIN_PASSWORD ?? 'secret',
    };

    const response = await server.post('/account/login').send(query);
    superadminLogin = response.body;
  });

  describe('list', () => {
    it('no filters', async () => {
      const query: DashboardContentChangelogListRequest = {
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'create_time', order: 'ASC' }],
      };

      const response = await server
        .post('/dashboard_content_changelog/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      response.body.data = response.body.data.map(omitTime);
      expect(response.body).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: response.body.data[0].id,
            dashboard_content_id: response.body.data[0].dashboard_content_id,
            diff: response.body.data[0].diff,
          },
        ],
      });

      expect(response.body.data[0].diff).toContain('diff --git a/data.json b/data.json');
      expect(response.body.data[0].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(response.body.data[0].diff).toContain('@@ -1,6 +1,8 @@');
      expect(response.body.data[0].diff).toContain(
        '-\t"name": "dashboard1_content2",\n' +
          '-\t"content": {}\n' +
          '+\t"name": "dashboard1_content2_updated",\n' +
          '+\t"content": {\n' +
          '+\t\t"tmp": "tmp1"\n' +
          '+\t}\n' +
          ' }\n',
      );

      changelogDashboardContentId = response.body.data[0].dashboard_content_id;
    });

    it('with filters', async () => {
      const query: DashboardContentChangelogListRequest = {
        filter: { dashboard_content_id: { value: changelogDashboardContentId, isFuzzy: false } },
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'create_time', order: 'ASC' }],
      };

      const response = await server
        .post('/dashboard_content_changelog/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      response.body.data = response.body.data.map(omitTime);
      expect(response.body).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: response.body.data[0].id,
            dashboard_content_id: response.body.data[0].dashboard_content_id,
            diff: response.body.data[0].diff,
          },
        ],
      });

      expect(response.body.data[0].diff).toContain('diff --git a/data.json b/data.json');
      expect(response.body.data[0].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(response.body.data[0].diff).toContain('@@ -1,6 +1,8 @@');
      expect(response.body.data[0].diff).toContain(
        '-\t"name": "dashboard1_content2",\n' +
          '-\t"content": {}\n' +
          '+\t"name": "dashboard1_content2_updated",\n' +
          '+\t"content": {\n' +
          '+\t\t"tmp": "tmp1"\n' +
          '+\t}\n' +
          ' }\n',
      );
    });
  });
});
