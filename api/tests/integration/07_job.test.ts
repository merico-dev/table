import { connectionHook, sleep } from './jest.util';
import { JobService } from '~/services/job.service';
import Job from '~/models/job';
import { dashboardDataSource } from '~/data_sources/dashboard';
import * as crypto from 'crypto';
import { omitFields } from '~/utils/helpers';

describe('JobService', () => {
  connectionHook();
  let jobService: JobService;
  const jobAuthId1 = crypto.randomUUID();
  const jobAuthId2 = crypto.randomUUID();
  const jobAuthId3 = crypto.randomUUID();
  const jobAuthId4 = crypto.randomUUID();

  beforeAll(async () => {
    jobService = new JobService();
  });

  describe('addRenameDataSourceJob', () => {
    it('add several jobs', async () => {
      const job1 = await JobService.addRenameDataSourceJob({
        type: 'postgresql',
        old_key: 'pg',
        new_key: 'pg_renamed',
        auth_id: null,
        auth_type: null,
      });
      expect(omitFields(job1, ['create_time', 'update_time'])).toMatchObject({
        type: 'RENAME_DATASOURCE',
        status: 'INIT',
        params: { type: 'postgresql', old_key: 'pg', new_key: 'pg_renamed', auth_id: null, auth_type: null },
        id: job1.id,
      });

      const job2 = await JobService.addRenameDataSourceJob({
        type: 'http',
        old_key: 'jsonplaceholder',
        new_key: 'jsonplaceholder_renamed',
        auth_id: null,
        auth_type: null,
      });
      expect(omitFields(job2, ['create_time', 'update_time'])).toMatchObject({
        type: 'RENAME_DATASOURCE',
        status: 'INIT',
        params: {
          type: 'http',
          old_key: 'jsonplaceholder',
          new_key: 'jsonplaceholder_renamed',
          auth_id: null,
          auth_type: null,
        },
        id: job2.id,
      });

      const job3 = await JobService.addRenameDataSourceJob({
        type: 'non_existent',
        old_key: 'old_key',
        new_key: 'new_key',
        auth_id: null,
        auth_type: null,
      });
      expect(omitFields(job3, ['create_time', 'update_time'])).toMatchObject({
        type: 'RENAME_DATASOURCE',
        status: 'INIT',
        params: { type: 'non_existent', old_key: 'old_key', new_key: 'new_key', auth_id: null, auth_type: null },
        id: job3.id,
      });
    });
  });

  describe('processDataSourceRename', () => {
    it('manually insert jobs', async () => {
      const jobRepo = dashboardDataSource.getRepository(Job);
      const job1 = new Job();
      job1.type = 'RENAME_DATASOURCE';
      job1.status = 'INIT';
      job1.params = {
        type: 'postgresql',
        old_key: 'pg_renamed',
        new_key: 'pg',
        auth_id: null,
        auth_type: null,
      };
      await jobRepo.save(job1);

      const job2 = new Job();
      job2.type = 'RENAME_DATASOURCE';
      job2.status = 'INIT';
      job2.params = {
        type: 'http',
        old_key: 'jsonplaceholder_renamed',
        new_key: 'jsonplaceholder',
        auth_id: null,
        auth_type: null,
      };
      await jobRepo.save(job2);

      const job3 = new Job();
      job3.type = 'RENAME_DATASOURCE';
      job3.status = 'INIT';
      job3.params = {
        type: 'non_existent',
        old_key: 'new_key',
        new_key: 'old_key',
        auth_id: null,
        auth_type: null,
      };
      await jobRepo.save(job3);

      await JobService.processDataSourceRename();
      await sleep(10000);
    });
  });

  describe('addFixDashboardPermissionJob', () => {
    it('add several jobs', async () => {
      const job1 = await JobService.addFixDashboardPermissionJob({
        auth_id: jobAuthId1,
        auth_type: 'ACCOUNT',
      });
      expect(omitFields(job1, ['create_time', 'update_time'])).toMatchObject({
        type: 'FIX_DASHBOARD_PERMISSION',
        status: 'INIT',
        params: { auth_id: jobAuthId1, auth_type: 'ACCOUNT' },
        id: job1.id,
      });

      const job2 = await JobService.addFixDashboardPermissionJob({
        auth_id: jobAuthId2,
        auth_type: 'APIKEY',
      });
      expect(omitFields(job2, ['create_time', 'update_time'])).toMatchObject({
        type: 'FIX_DASHBOARD_PERMISSION',
        status: 'INIT',
        params: { auth_id: jobAuthId2, auth_type: 'APIKEY' },
        id: job2.id,
      });
    });
  });

  describe('processFixDashboardPermission', () => {
    it('manually insert jobs', async () => {
      const jobRepo = dashboardDataSource.getRepository(Job);
      const job1 = new Job();
      job1.type = 'FIX_DASHBOARD_PERMISSION';
      job1.status = 'INIT';
      job1.params = {
        auth_id: jobAuthId3,
        auth_type: 'ACCOUNT',
      };
      await jobRepo.save(job1);

      const job2 = new Job();
      job2.type = 'FIX_DASHBOARD_PERMISSION';
      job2.status = 'INIT';
      job2.params = {
        auth_id: jobAuthId4,
        auth_type: 'APIKEY',
      };
      await jobRepo.save(job2);

      await JobService.processFixDashboardPermission();
      await sleep(10000);
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const results = await jobService.list(undefined, [{ field: 'create_time', order: 'ASC' }], {
        page: 1,
        pagesize: 20,
      });
      results.data = results.data.map((el) => omitFields(el, ['create_time', 'update_time']));
      expect(results).toMatchObject({
        total: 14,
        offset: 0,
        data: [
          {
            id: results.data[0].id,
            type: 'FIX_DASHBOARD_PERMISSION',
            status: 'SUCCESS',
            params: {
              auth_id: results.data[0].params['auth_id'],
              auth_type: 'ACCOUNT',
            },
            result: { affected_dashboard_permissions: [] },
          },
          {
            id: results.data[1].id,
            type: 'FIX_DASHBOARD_PERMISSION',
            status: 'SUCCESS',
            params: {
              auth_id: results.data[1].params['auth_id'],
              auth_type: 'APIKEY',
            },
            result: { affected_dashboard_permissions: [] },
          },
          {
            id: results.data[2].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'postgresql',
              auth_id: null,
              new_key: 'pg_2_renamed',
              old_key: 'pg_2',
              auth_type: null,
            },
            result: { affected_dashboard_contents: [] },
          },
          {
            id: results.data[3].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'http',
              auth_id: null,
              new_key: 'jsonplaceholder_2_renamed',
              old_key: 'jsonplaceholder_2',
              auth_type: null,
            },
            result: { affected_dashboard_contents: [] },
          },
          {
            id: results.data[4].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'postgresql',
              auth_id: null,
              new_key: 'pg_renamed',
              old_key: 'pg',
              auth_type: null,
            },
            result: {
              affected_dashboard_contents: [
                {
                  queries: ['pgQuery1'],
                  contentId: results.data[4].result['affected_dashboard_contents'][0].contentId,
                },
                {
                  queries: ['pgQuery2'],
                  contentId: results.data[4].result['affected_dashboard_contents'][1].contentId,
                },
              ],
            },
          },
          {
            id: results.data[5].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'http',
              auth_id: null,
              new_key: 'jsonplaceholder_renamed',
              old_key: 'jsonplaceholder',
              auth_type: null,
            },
            result: {
              affected_dashboard_contents: [
                {
                  queries: ['httpQuery1'],
                  contentId: results.data[5].result['affected_dashboard_contents'][0].contentId,
                },
                {
                  queries: ['httpQuery2'],
                  contentId: results.data[5].result['affected_dashboard_contents'][1].contentId,
                },
              ],
            },
          },
          {
            id: results.data[6].id,
            type: 'RENAME_DATASOURCE',
            status: 'FAILED',
            params: {
              type: 'non_existent',
              auth_id: null,
              new_key: 'new_key',
              old_key: 'old_key',
              auth_type: null,
            },
            result: results.data[6].result,
          },
          {
            id: results.data[7].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'postgresql',
              auth_id: null,
              new_key: 'pg',
              old_key: 'pg_renamed',
              auth_type: null,
            },
            result: {
              affected_dashboard_contents: [],
            },
          },
          {
            id: results.data[8].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'http',
              auth_id: null,
              new_key: 'jsonplaceholder',
              old_key: 'jsonplaceholder_renamed',
              auth_type: null,
            },
            result: {
              affected_dashboard_contents: [],
            },
          },
          {
            id: results.data[9].id,
            type: 'RENAME_DATASOURCE',
            status: 'FAILED',
            params: {
              type: 'non_existent',
              auth_id: null,
              new_key: 'old_key',
              old_key: 'new_key',
              auth_type: null,
            },
            result: results.data[9].result,
          },
          {
            id: results.data[10].id,
            type: 'FIX_DASHBOARD_PERMISSION',
            status: 'SUCCESS',
            params: {
              auth_id: jobAuthId1,
              auth_type: 'ACCOUNT',
            },
            result: { affected_dashboard_permissions: [] },
          },
          {
            id: results.data[11].id,
            type: 'FIX_DASHBOARD_PERMISSION',
            status: 'SUCCESS',
            params: {
              auth_id: jobAuthId2,
              auth_type: 'APIKEY',
            },
            result: { affected_dashboard_permissions: [] },
          },
          {
            id: results.data[12].id,
            type: 'FIX_DASHBOARD_PERMISSION',
            status: 'SUCCESS',
            params: {
              auth_id: jobAuthId3,
              auth_type: 'ACCOUNT',
            },
            result: { affected_dashboard_permissions: [] },
          },
          {
            id: results.data[13].id,
            type: 'FIX_DASHBOARD_PERMISSION',
            status: 'SUCCESS',
            params: {
              auth_id: jobAuthId4,
              auth_type: 'APIKEY',
            },
            result: { affected_dashboard_permissions: [] },
          },
        ],
      });

      expect(results.data[6].result['error'].message).toContain(
        'Could not find any entity of type "DataSource" matching',
      );
      expect(results.data[6].result['error'].message).toContain('"type": "non_existent"');
      expect(results.data[6].result['error'].message).toContain('"key": "old_key"');
      expect(results.data[9].result['error'].message).toContain(
        'Could not find any entity of type "DataSource" matching',
      );
      expect(results.data[9].result['error'].message).toContain('"type": "non_existent"');
      expect(results.data[9].result['error'].message).toContain('"key": "new_key"');
    });

    it('with SUCCESS search filter', async () => {
      const results = await jobService.list(
        { status: { value: 'SUCCESS', isFuzzy: true }, type: { value: '', isFuzzy: true } },
        [{ field: 'create_time', order: 'ASC' }],
        { page: 1, pagesize: 20 },
      );
      results.data = results.data.map((el) => omitFields(el, ['create_time', 'update_time']));
      expect(results).toMatchObject({
        total: 12,
        offset: 0,
        data: [
          {
            id: results.data[0].id,
            type: 'FIX_DASHBOARD_PERMISSION',
            status: 'SUCCESS',
            params: {
              auth_id: results.data[0].params['auth_id'],
              auth_type: 'ACCOUNT',
            },
            result: { affected_dashboard_permissions: [] },
          },
          {
            id: results.data[1].id,
            type: 'FIX_DASHBOARD_PERMISSION',
            status: 'SUCCESS',
            params: {
              auth_id: results.data[1].params['auth_id'],
              auth_type: 'APIKEY',
            },
            result: { affected_dashboard_permissions: [] },
          },
          {
            id: results.data[2].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'postgresql',
              auth_id: null,
              new_key: 'pg_2_renamed',
              old_key: 'pg_2',
              auth_type: null,
            },
            result: { affected_dashboard_contents: [] },
          },
          {
            id: results.data[3].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'http',
              auth_id: null,
              new_key: 'jsonplaceholder_2_renamed',
              old_key: 'jsonplaceholder_2',
              auth_type: null,
            },
            result: { affected_dashboard_contents: [] },
          },
          {
            id: results.data[4].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'postgresql',
              auth_id: null,
              new_key: 'pg_renamed',
              old_key: 'pg',
              auth_type: null,
            },
            result: {
              affected_dashboard_contents: [
                {
                  queries: ['pgQuery1'],
                  contentId: results.data[4].result['affected_dashboard_contents'][0].contentId,
                },
                {
                  queries: ['pgQuery2'],
                  contentId: results.data[4].result['affected_dashboard_contents'][1].contentId,
                },
              ],
            },
          },
          {
            id: results.data[5].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'http',
              auth_id: null,
              new_key: 'jsonplaceholder_renamed',
              old_key: 'jsonplaceholder',
              auth_type: null,
            },
            result: {
              affected_dashboard_contents: [
                {
                  queries: ['httpQuery1'],
                  contentId: results.data[5].result['affected_dashboard_contents'][0].contentId,
                },
                {
                  queries: ['httpQuery2'],
                  contentId: results.data[5].result['affected_dashboard_contents'][1].contentId,
                },
              ],
            },
          },
          {
            id: results.data[6].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'postgresql',
              auth_id: null,
              new_key: 'pg',
              old_key: 'pg_renamed',
              auth_type: null,
            },
            result: {
              affected_dashboard_contents: [],
            },
          },
          {
            id: results.data[7].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: {
              type: 'http',
              auth_id: null,
              new_key: 'jsonplaceholder',
              old_key: 'jsonplaceholder_renamed',
              auth_type: null,
            },
            result: {
              affected_dashboard_contents: [],
            },
          },
          {
            id: results.data[8].id,
            type: 'FIX_DASHBOARD_PERMISSION',
            status: 'SUCCESS',
            params: {
              auth_id: jobAuthId1,
              auth_type: 'ACCOUNT',
            },
            result: { affected_dashboard_permissions: [] },
          },
          {
            id: results.data[9].id,
            type: 'FIX_DASHBOARD_PERMISSION',
            status: 'SUCCESS',
            params: {
              auth_id: jobAuthId2,
              auth_type: 'APIKEY',
            },
            result: { affected_dashboard_permissions: [] },
          },
          {
            id: results.data[10].id,
            type: 'FIX_DASHBOARD_PERMISSION',
            status: 'SUCCESS',
            params: {
              auth_id: jobAuthId3,
              auth_type: 'ACCOUNT',
            },
            result: { affected_dashboard_permissions: [] },
          },
          {
            id: results.data[11].id,
            type: 'FIX_DASHBOARD_PERMISSION',
            status: 'SUCCESS',
            params: {
              auth_id: jobAuthId4,
              auth_type: 'APIKEY',
            },
            result: { affected_dashboard_permissions: [] },
          },
        ],
      });
    });

    it('with FAILED search filter', async () => {
      const results = await jobService.list(
        { status: { value: 'FAILED', isFuzzy: true }, type: { value: '', isFuzzy: true } },
        [{ field: 'create_time', order: 'ASC' }],
        { page: 1, pagesize: 20 },
      );
      results.data = results.data.map((el) => omitFields(el, ['create_time', 'update_time']));
      expect(results).toMatchObject({
        total: 2,
        offset: 0,
        data: [
          {
            id: results.data[0].id,
            type: 'RENAME_DATASOURCE',
            status: 'FAILED',
            params: { type: 'non_existent', new_key: 'new_key', old_key: 'old_key' },
            result: results.data[0].result,
          },
          {
            id: results.data[1].id,
            type: 'RENAME_DATASOURCE',
            status: 'FAILED',
            params: { type: 'non_existent', new_key: 'old_key', old_key: 'new_key' },
            result: results.data[1].result,
          },
        ],
      });

      expect(results.data[0].result['error'].message).toContain(
        'Could not find any entity of type "DataSource" matching',
      );
      expect(results.data[0].result['error'].message).toContain('"type": "non_existent"');
      expect(results.data[0].result['error'].message).toContain('"key": "old_key"');
      expect(results.data[1].result['error'].message).toContain(
        'Could not find any entity of type "DataSource" matching',
      );
      expect(results.data[1].result['error'].message).toContain('"type": "non_existent"');
      expect(results.data[1].result['error'].message).toContain('"key": "new_key"');
    });
  });
});
