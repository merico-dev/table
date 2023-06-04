import { connectionHook } from './jest.util';
import { DashboardContentChangelogService } from '~/services/dashboard_content_changelog.service';

describe('DashboardContentChangelogService', () => {
  connectionHook();
  let dashboardContentChangelogService: DashboardContentChangelogService;
  let changelogDashboardContentId: string;

  beforeAll(async () => {
    dashboardContentChangelogService = new DashboardContentChangelogService();
  });

  describe('list', () => {
    it('no filters', async () => {
      const results = await dashboardContentChangelogService.list(undefined, [{ field: 'create_time', order: 'ASC' }], {
        page: 1,
        pagesize: 20,
      });
      expect(results.total).toEqual(4);
      expect(results.offset).toEqual(0);

      expect(results.data[0].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[0].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(results.data[0].diff).toContain('@@ -7,7 +7,7 @@');
      expect(results.data[0].diff).toContain('-\t\t\t\t\t"key": "pg",\n' + '+\t\t\t\t\t"key": "pg_renamed",\n');
      expect(results.data[0].diff).toContain('@@ -17,5 +17,9 @@');
      expect(results.data[0].diff).toContain(
        '-\t}\n' +
          '+\t},\n' +
          '+\t"content_id": null,\n' +
          '+\t"is_removed": false,\n' +
          '+\t"is_preset": false,\n' +
          '+\t"group": ""\n' +
          ' }\n',
      );

      expect(results.data[1].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[1].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(results.data[1].diff).toContain('@@ -7,7 +7,7 @@');
      expect(results.data[1].diff).toContain('-\t\t\t\t\t"key": "pg",\n' + '+\t\t\t\t\t"key": "pg_renamed",\n');
      expect(results.data[1].diff).toContain('@@ -17,5 +17,9 @@');
      expect(results.data[1].diff).toContain(
        '-\t}\n' +
          '+\t},\n' +
          '+\t"content_id": null,\n' +
          '+\t"is_removed": false,\n' +
          '+\t"is_preset": false,\n' +
          '+\t"group": ""\n' +
          ' }\n',
      );

      expect(results.data[2].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[2].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(results.data[2].diff).toContain('@@ -12,7 +12,7 @@');
      expect(results.data[2].diff).toContain(
        '-\t\t\t\t\t"key": "jsonplaceholder",\n' + '+\t\t\t\t\t"key": "jsonplaceholder_renamed",\n',
      );

      expect(results.data[3].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[3].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(results.data[3].diff).toContain('@@ -12,7 +12,7 @@');
      expect(results.data[3].diff).toContain(
        '-\t\t\t\t\t"key": "jsonplaceholder",\n' + '+\t\t\t\t\t"key": "jsonplaceholder_renamed",\n',
      );

      changelogDashboardContentId = results.data[0].dashboard_content_id;
    });

    it('with search filter', async () => {
      const results = await dashboardContentChangelogService.list(
        { dashboard_content_id: { value: changelogDashboardContentId, isFuzzy: true } },
        [{ field: 'create_time', order: 'ASC' }],
        { page: 1, pagesize: 20 },
      );

      expect(results.total).toEqual(2);
      expect(results.offset).toEqual(0);

      expect(results.data[0].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[0].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(results.data[0].diff).toContain('@@ -7,7 +7,7 @@');
      expect(results.data[0].diff).toContain('-\t\t\t\t\t"key": "pg",\n' + '+\t\t\t\t\t"key": "pg_renamed",\n');
      expect(results.data[0].diff).toContain('@@ -17,5 +17,9 @@');
      expect(results.data[0].diff).toContain(
        '-\t}\n' +
          '+\t},\n' +
          '+\t"content_id": null,\n' +
          '+\t"is_removed": false,\n' +
          '+\t"is_preset": false,\n' +
          '+\t"group": ""\n' +
          ' }\n',
      );

      expect(results.data[1].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[1].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(results.data[1].diff).toContain('@@ -12,7 +12,7 @@');
      expect(results.data[1].diff).toContain(
        '-\t\t\t\t\t"key": "jsonplaceholder",\n' + '+\t\t\t\t\t"key": "jsonplaceholder_renamed",\n',
      );
    });
  });
});
