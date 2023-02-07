import { connectionHook } from './jest.util';
import { DashboardChangelogService } from '~/services/dashboard_changelog.service';

describe('DashboardChangelogService', () => {
  connectionHook();
  let dashboardChangelogService: DashboardChangelogService;
  let changelogDashboardId: string;

  beforeAll(async () => {
    dashboardChangelogService = new DashboardChangelogService();
  });

  describe('list', () => {
    it('no filters', async () => {
      const results = await dashboardChangelogService.list(
        undefined,
        { field: 'create_time', order: 'ASC' },
        { page: 1, pagesize: 20 },
      );

      expect(results).toMatchObject({
        total: 11,
        offset: 0,
        data: [
          {
            id: results.data[0].id,
            dashboard_id: results.data[0].dashboard_id,
            diff: results.data[0].diff,
            create_time: results.data[0].create_time
          },
          {
            id: results.data[1].id,
            dashboard_id: results.data[1].dashboard_id,
            diff: results.data[1].diff,
            create_time: results.data[1].create_time
          },
          {
            id: results.data[2].id,
            dashboard_id: results.data[2].dashboard_id,
            diff: results.data[2].diff,
            create_time: results.data[2].create_time
          },
          {
            id: results.data[3].id,
            dashboard_id: results.data[3].dashboard_id,
            diff: results.data[3].diff,
            create_time: results.data[3].create_time
          },
          {
            id: results.data[4].id,
            dashboard_id: results.data[4].dashboard_id,
            diff: results.data[4].diff,
            create_time: results.data[4].create_time
          },
          {
            id: results.data[5].id,
            dashboard_id: results.data[5].dashboard_id,
            diff: results.data[5].diff,
            create_time: results.data[5].create_time
          },
          {
            id: results.data[6].id,
            dashboard_id: results.data[6].dashboard_id,
            diff: results.data[6].diff,
            create_time: results.data[6].create_time
          },
          {
            id: results.data[7].id,
            dashboard_id: results.data[7].dashboard_id,
            diff: results.data[7].diff,
            create_time: results.data[7].create_time
          },
          {
            id: results.data[8].id,
            dashboard_id: results.data[8].dashboard_id,
            diff: results.data[8].diff,
            create_time: results.data[8].create_time
          },
          {
            id: results.data[9].id,
            dashboard_id: results.data[9].dashboard_id,
            diff: results.data[9].diff,
            create_time: results.data[9].create_time
          },
          {
            id: results.data[10].id,
            dashboard_id: results.data[10].dashboard_id,
            diff: results.data[10].diff,
            create_time: results.data[10].create_time
          },
        ]
      });

      expect(results.data[0].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[0].diff).toContain('--- a/data.json\n' +
      '+++ b/data.json');
      expect(results.data[0].diff).toContain('@@ -2,9 +2,9 @@');
      expect(results.data[0].diff).toContain('-\t"name": "dashboard3",\n' +
      '+\t"name": "dashboard3_updated",\n' +
      ' \t"content": {},\n' +
      '-\t"is_removed": false,\n' +
      '+\t"is_removed": true,\n' +
      ' \t"is_preset": false,\n' +
      '-\t"group": "2"\n' +
      '+\t"group": "2_updated"\n' +
      ' }\n');

      expect(results.data[1].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[1].diff).toContain('--- a/data.json\n' +
      '+++ b/data.json');
      expect(results.data[1].diff).toContain('@@ -2,7 +2,7 @@');
      expect(results.data[1].diff).toContain('-\t"name": "dashboard2",\n' +
      '+\t"name": "dashboard2_updated",\n' +
      ' \t"content": {\n' +
      ' \t\t"definition": {\n' +
      ' \t\t\t"queries": [\n');

      expect(results.data[2].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[2].diff).toContain('--- a/data.json\n' +
      '+++ b/data.json');
      expect(results.data[2].diff).toContain('@@ -19,7 +19,7 @@');
      expect(results.data[2].diff).toContain(' \t\t\t]\n' +
      ' \t\t}\n' +
      ' \t},\n' +
      '-\t"is_removed": false,\n' +
      '+\t"is_removed": true,\n' +
      ' \t"is_preset": true,\n' +
      ' \t"group": "1_updated"\n' +
      ' }\n');

      expect(results.data[3].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[3].diff).toContain('--- a/data.json\n' +
      '+++ b/data.json');
      expect(results.data[3].diff).toContain('@@ -6,7 +6,7 @@');
      expect(results.data[3].diff).toContain(' \t\t\t"queries": [\n' +
      ' \t\t\t\t{\n' +
      ' \t\t\t\t\t"id": "pgQuery1",\n' +
      '-\t\t\t\t\t"key": "pg",\n' +
      '+\t\t\t\t\t"key": "pg_renamed",\n' +
      ' \t\t\t\t\t"type": "postgresql"\n' +
      ' \t\t\t\t},\n' +
      ' \t\t\t\t{\n');

      expect(results.data[4].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[4].diff).toContain('--- a/data.json\n' +
      '+++ b/data.json');
      expect(results.data[4].diff).toContain('@@ -6,7 +6,7 @@');
      expect(results.data[4].diff).toContain(' \t\t\t"queries": [\n' +
      ' \t\t\t\t{\n' +
      ' \t\t\t\t\t"id": "pgQuery2",\n' +
      '-\t\t\t\t\t"key": "pg",\n' +
      '+\t\t\t\t\t"key": "pg_renamed",\n' +
      ' \t\t\t\t\t"type": "postgresql"\n' +
      ' \t\t\t\t},\n' +
      ' \t\t\t\t{\n');

      expect(results.data[5].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[5].diff).toContain('--- a/data.json\n' +
      '+++ b/data.json');
      expect(results.data[5].diff).toContain('@@ -11,7 +11,7 @@');
      expect(results.data[5].diff).toContain(' \t\t\t\t},\n' +
      ' \t\t\t\t{\n' +
      ' \t\t\t\t\t"id": "httpQuery1",\n' +
      '-\t\t\t\t\t"key": "jsonplaceholder",\n' +
      '+\t\t\t\t\t"key": "jsonplaceholder_renamed",\n' +
      ' \t\t\t\t\t"type": "http"\n' +
      ' \t\t\t\t}\n' +
      ' \t\t\t]\n');

      expect(results.data[6].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[6].diff).toContain('--- a/data.json\n' +
      '+++ b/data.json');
      expect(results.data[6].diff).toContain('@@ -11,7 +11,7 @@');
      expect(results.data[6].diff).toContain(' \t\t\t\t},\n' +
      ' \t\t\t\t{\n' +
      ' \t\t\t\t\t"id": "httpQuery2",\n' +
      '-\t\t\t\t\t"key": "jsonplaceholder",\n' +
      '+\t\t\t\t\t"key": "jsonplaceholder_renamed",\n' +
      ' \t\t\t\t\t"type": "http"\n' +
      ' \t\t\t\t}\n' +
      ' \t\t\t]\n');

      expect(results.data[7].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[7].diff).toContain('--- a/data.json\n' +
      '+++ b/data.json');
      expect(results.data[7].diff).toContain('@@ -6,7 +6,7 @@');
      expect(results.data[7].diff).toContain(' \t\t\t"queries": [\n' +
      ' \t\t\t\t{\n' +
      ' \t\t\t\t\t"id": "pgQuery1",\n' +
      '-\t\t\t\t\t"key": "pg_renamed",\n' +
      '+\t\t\t\t\t"key": "pg",\n' +
      ' \t\t\t\t\t"type": "postgresql"\n' +
      ' \t\t\t\t},\n' +
      ' \t\t\t\t{\n');

      expect(results.data[8].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[8].diff).toContain('--- a/data.json\n' +
      '+++ b/data.json');
      expect(results.data[8].diff).toContain('@@ -6,7 +6,7 @@');
      expect(results.data[8].diff).toContain(' \t\t\t"queries": [\n' +
      ' \t\t\t\t{\n' +
      ' \t\t\t\t\t"id": "pgQuery2",\n' +
      '-\t\t\t\t\t"key": "pg_renamed",\n' +
      '+\t\t\t\t\t"key": "pg",\n' +
      ' \t\t\t\t\t"type": "postgresql"\n' +
      ' \t\t\t\t},\n' +
      ' \t\t\t\t{\n');

      expect(results.data[9].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[9].diff).toContain('--- a/data.json\n' +
      '+++ b/data.json');
      expect(results.data[9].diff).toContain('@@ -11,7 +11,7 @@');
      expect(results.data[9].diff).toContain(' \t\t\t\t},\n' +
      ' \t\t\t\t{\n' +
      ' \t\t\t\t\t"id": "httpQuery1",\n' +
      '-\t\t\t\t\t"key": "jsonplaceholder_renamed",\n' +
      '+\t\t\t\t\t"key": "jsonplaceholder",\n' +
      ' \t\t\t\t\t"type": "http"\n' +
      ' \t\t\t\t}\n' +
      ' \t\t\t]\n');

      expect(results.data[10].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[10].diff).toContain('--- a/data.json\n' +
      '+++ b/data.json');
      expect(results.data[10].diff).toContain('@@ -11,7 +11,7 @@');
      expect(results.data[10].diff).toContain(' \t\t\t\t},\n' +
      ' \t\t\t\t{\n' +
      ' \t\t\t\t\t"id": "httpQuery2",\n' +
      '-\t\t\t\t\t"key": "jsonplaceholder_renamed",\n' +
      '+\t\t\t\t\t"key": "jsonplaceholder",\n' +
      ' \t\t\t\t\t"type": "http"\n' +
      ' \t\t\t\t}\n' +
      ' \t\t\t]\n');

      changelogDashboardId = results.data[0].dashboard_id;
    });

    it('with search filter', async () => {
      const results = await dashboardChangelogService.list(
        { search: changelogDashboardId },
        { field: 'create_time', order: 'ASC' },
        { page: 1, pagesize: 20 },
      );

      expect(results).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: results.data[0].id,
            dashboard_id: results.data[0].dashboard_id,
            diff: results.data[0].diff,
            create_time: results.data[0].create_time
          }
        ]
      });

      expect(results.data[0].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[0].diff).toContain('--- a/data.json\n' +
      '+++ b/data.json');
      expect(results.data[0].diff).toContain('@@ -2,9 +2,9 @@');
      expect(results.data[0].diff).toContain('-\t"name": "dashboard3",\n' +
      '+\t"name": "dashboard3_updated",\n' +
      ' \t"content": {},\n' +
      '-\t"is_removed": false,\n' +
      '+\t"is_removed": true,\n' +
      ' \t"is_preset": false,\n' +
      '-\t"group": "2"\n' +
      '+\t"group": "2_updated"\n' +
      ' }\n');
    });
  });
});
