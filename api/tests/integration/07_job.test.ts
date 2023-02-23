import { connectionHook, sleep } from './jest.util';
import { JobService } from '~/services/job.service';
import Job from '~/models/job';
import { dashboardDataSource } from '~/data_sources/dashboard';

describe('JobService', () => {
  connectionHook();
  let jobService: JobService;

  beforeAll(async () => {
    jobService = new JobService();
  });

  describe('addRenameDataSourceJob', () => {
    it('add several jobs', async () => {
      const job1 = await JobService.addRenameDataSourceJob({
        type: 'postgresql',
        old_key: 'pg',
        new_key: 'pg_renamed',
      });
      expect(job1).toMatchObject({
        type: 'RENAME_DATASOURCE',
        status: 'INIT',
        params: { type: 'postgresql', old_key: 'pg', new_key: 'pg_renamed' },
        id: job1.id,
        create_time: job1.create_time,
        update_time: job1.update_time,
      });

      const job2 = await JobService.addRenameDataSourceJob({
        type: 'http',
        old_key: 'jsonplaceholder',
        new_key: 'jsonplaceholder_renamed',
      });
      expect(job2).toMatchObject({
        type: 'RENAME_DATASOURCE',
        status: 'INIT',
        params: { type: 'http', old_key: 'jsonplaceholder', new_key: 'jsonplaceholder_renamed' },
        id: job2.id,
        create_time: job2.create_time,
        update_time: job2.update_time,
      });

      const job3 = await JobService.addRenameDataSourceJob({
        type: 'non_existent',
        old_key: 'old_key',
        new_key: 'new_key',
      });
      expect(job3).toMatchObject({
        type: 'RENAME_DATASOURCE',
        status: 'INIT',
        params: { type: 'non_existent', old_key: 'old_key', new_key: 'new_key' },
        id: job3.id,
        create_time: job3.create_time,
        update_time: job3.update_time,
      });
    });
  });

  describe('processDataSourceRename', () => {
    it('manually insert jobs and run', async () => {
      const jobRepo = dashboardDataSource.getRepository(Job);
      const job1 = new Job();
      job1.type = 'RENAME_DATASOURCE';
      job1.status = 'INIT';
      job1.params = {
        type: 'postgresql',
        old_key: 'pg_renamed',
        new_key: 'pg',
      };
      await jobRepo.save(job1);

      const job2 = new Job();
      job2.type = 'RENAME_DATASOURCE';
      job2.status = 'INIT';
      job2.params = {
        type: 'http',
        old_key: 'jsonplaceholder_renamed',
        new_key: 'jsonplaceholder',
      };
      await jobRepo.save(job2);

      const job3 = new Job();
      job3.type = 'RENAME_DATASOURCE';
      job3.status = 'INIT';
      job3.params = {
        type: 'non_existent',
        old_key: 'new_key',
        new_key: 'old_key',
      };
      await jobRepo.save(job3);

      await JobService.processDataSourceRename();
      await sleep(10000);
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const results = await jobService.list(undefined, [{ field: 'create_time', order: 'ASC' }], {
        page: 1,
        pagesize: 20,
      });
      expect(results).toMatchObject({
        total: 8,
        offset: 0,
        data: [
          {
            id: results.data[0].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: { type: 'postgresql', new_key: 'pg_2_renamed', old_key: 'pg_2' },
            result: { affected_dashboards: [] },
            create_time: results.data[0].create_time,
            update_time: results.data[0].update_time,
          },
          {
            id: results.data[1].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: { type: 'http', new_key: 'jsonplaceholder_2_renamed', old_key: 'jsonplaceholder_2' },
            result: { affected_dashboards: [] },
            create_time: results.data[1].create_time,
            update_time: results.data[1].update_time,
          },
          {
            id: results.data[2].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: { type: 'postgresql', new_key: 'pg_renamed', old_key: 'pg' },
            result: {
              affected_dashboards: [
                {
                  queries: ['pgQuery1'],
                  dashboardId: results.data[2].result['affected_dashboards'][0].dashboardId,
                },
                {
                  queries: ['pgQuery2'],
                  dashboardId: results.data[2].result['affected_dashboards'][1].dashboardId,
                },
              ],
            },
            create_time: results.data[2].create_time,
            update_time: results.data[2].update_time,
          },
          {
            id: results.data[3].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: { type: 'http', new_key: 'jsonplaceholder_renamed', old_key: 'jsonplaceholder' },
            result: {
              affected_dashboards: [
                {
                  queries: ['httpQuery1'],
                  dashboardId: results.data[3].result['affected_dashboards'][0].dashboardId,
                },
                {
                  queries: ['httpQuery2'],
                  dashboardId: results.data[3].result['affected_dashboards'][1].dashboardId,
                },
              ],
            },
            create_time: results.data[3].create_time,
            update_time: results.data[3].update_time,
          },
          {
            id: results.data[4].id,
            type: 'RENAME_DATASOURCE',
            status: 'FAILED',
            params: { type: 'non_existent', new_key: 'new_key', old_key: 'old_key' },
            result: results.data[4].result,
            create_time: results.data[4].create_time,
            update_time: results.data[4].update_time,
          },
          {
            id: results.data[5].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: { type: 'postgresql', new_key: 'pg', old_key: 'pg_renamed' },
            result: {
              affected_dashboards: [
                {
                  queries: ['pgQuery1'],
                  dashboardId: results.data[5].result['affected_dashboards'][0].dashboardId,
                },
                {
                  queries: ['pgQuery2'],
                  dashboardId: results.data[5].result['affected_dashboards'][1].dashboardId,
                },
              ],
            },
            create_time: results.data[5].create_time,
            update_time: results.data[5].update_time,
          },
          {
            id: results.data[6].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: { type: 'http', new_key: 'jsonplaceholder', old_key: 'jsonplaceholder_renamed' },
            result: {
              affected_dashboards: [
                {
                  queries: ['httpQuery1'],
                  dashboardId: results.data[6].result['affected_dashboards'][0].dashboardId,
                },
                {
                  queries: ['httpQuery2'],
                  dashboardId: results.data[6].result['affected_dashboards'][1].dashboardId,
                },
              ],
            },
            create_time: results.data[6].create_time,
            update_time: results.data[6].update_time,
          },
          {
            id: results.data[7].id,
            type: 'RENAME_DATASOURCE',
            status: 'FAILED',
            params: { type: 'non_existent', new_key: 'old_key', old_key: 'new_key' },
            result: results.data[7].result,
            create_time: results.data[7].create_time,
            update_time: results.data[7].update_time,
          },
        ],
      });

      expect(results.data[4].result['error'].message).toContain(
        'Could not find any entity of type "DataSource" matching',
      );
      expect(results.data[4].result['error'].message).toContain('"type": "non_existent"');
      expect(results.data[4].result['error'].message).toContain('"key": "old_key"');
      expect(results.data[7].result['error'].message).toContain(
        'Could not find any entity of type "DataSource" matching',
      );
      expect(results.data[7].result['error'].message).toContain('"type": "non_existent"');
      expect(results.data[7].result['error'].message).toContain('"key": "new_key"');
    });

    it('with SUCCESS search filter', async () => {
      const results = await jobService.list(
        { status: { value: 'SUCCESS', isFuzzy: true }, type: { value: '', isFuzzy: true } },
        [{ field: 'create_time', order: 'ASC' }],
        { page: 1, pagesize: 20 },
      );
      expect(results).toMatchObject({
        total: 6,
        offset: 0,
        data: [
          {
            id: results.data[0].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: { type: 'postgresql', new_key: 'pg_2_renamed', old_key: 'pg_2' },
            result: { affected_dashboards: [] },
            create_time: results.data[0].create_time,
            update_time: results.data[0].update_time,
          },
          {
            id: results.data[1].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: { type: 'http', new_key: 'jsonplaceholder_2_renamed', old_key: 'jsonplaceholder_2' },
            result: { affected_dashboards: [] },
            create_time: results.data[1].create_time,
            update_time: results.data[1].update_time,
          },
          {
            id: results.data[2].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: { type: 'postgresql', new_key: 'pg_renamed', old_key: 'pg' },
            result: {
              affected_dashboards: [
                {
                  queries: ['pgQuery1'],
                  dashboardId: results.data[2].result['affected_dashboards'][0].dashboardId,
                },
                {
                  queries: ['pgQuery2'],
                  dashboardId: results.data[2].result['affected_dashboards'][1].dashboardId,
                },
              ],
            },
            create_time: results.data[2].create_time,
            update_time: results.data[2].update_time,
          },
          {
            id: results.data[3].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: { type: 'http', new_key: 'jsonplaceholder_renamed', old_key: 'jsonplaceholder' },
            result: {
              affected_dashboards: [
                {
                  queries: ['httpQuery1'],
                  dashboardId: results.data[3].result['affected_dashboards'][0].dashboardId,
                },
                {
                  queries: ['httpQuery2'],
                  dashboardId: results.data[3].result['affected_dashboards'][1].dashboardId,
                },
              ],
            },
            create_time: results.data[3].create_time,
            update_time: results.data[3].update_time,
          },
          {
            id: results.data[4].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: { type: 'postgresql', new_key: 'pg', old_key: 'pg_renamed' },
            result: {
              affected_dashboards: [
                {
                  queries: ['pgQuery1'],
                  dashboardId: results.data[4].result['affected_dashboards'][0].dashboardId,
                },
                {
                  queries: ['pgQuery2'],
                  dashboardId: results.data[4].result['affected_dashboards'][1].dashboardId,
                },
              ],
            },
            create_time: results.data[4].create_time,
            update_time: results.data[4].update_time,
          },
          {
            id: results.data[5].id,
            type: 'RENAME_DATASOURCE',
            status: 'SUCCESS',
            params: { type: 'http', new_key: 'jsonplaceholder', old_key: 'jsonplaceholder_renamed' },
            result: {
              affected_dashboards: [
                {
                  queries: ['httpQuery1'],
                  dashboardId: results.data[5].result['affected_dashboards'][0].dashboardId,
                },
                {
                  queries: ['httpQuery2'],
                  dashboardId: results.data[5].result['affected_dashboards'][1].dashboardId,
                },
              ],
            },
            create_time: results.data[5].create_time,
            update_time: results.data[5].update_time,
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
            create_time: results.data[0].create_time,
            update_time: results.data[0].update_time,
          },
          {
            id: results.data[1].id,
            type: 'RENAME_DATASOURCE',
            status: 'FAILED',
            params: { type: 'non_existent', new_key: 'old_key', old_key: 'new_key' },
            result: results.data[1].result,
            create_time: results.data[1].create_time,
            update_time: results.data[1].update_time,
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
