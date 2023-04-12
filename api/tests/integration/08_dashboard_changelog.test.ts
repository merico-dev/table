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
      const results = await dashboardChangelogService.list(undefined, [{ field: 'create_time', order: 'ASC' }], {
        page: 1,
        pagesize: 20,
      });
      expect(results.total).toEqual(3);
      expect(results.offset).toEqual(0);

      expect(results.data[0].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[0].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(results.data[0].diff).toContain('@@ -1,8 +1,8 @@');
      expect(results.data[0].diff).toContain(
        '-\t"name": "dashboard3",\n' +
          '+\t"name": "dashboard3_updated",\n' +
          ' \t"content_id": null,\n' +
          '-\t"is_removed": false,\n' +
          '+\t"is_removed": true,\n' +
          ' \t"is_preset": false,\n' +
          '-\t"group": "2"\n' +
          '+\t"group": "2_updated"\n' +
          ' }\n',
      );

      expect(results.data[1].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[1].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(results.data[1].diff).toContain('@@ -1,8 +1,8 @@');
      expect(results.data[1].diff).toContain(
        '-\t"name": "dashboard2",\n' +
          '+\t"name": "dashboard2_updated",\n' +
          ' \t"content_id": "5959a66b-5b6b-4509-9d87-bb8b96100658",\n' +
          ' \t"is_removed": false,\n' +
          ' \t"is_preset": true,\n' +
          '-\t"group": "1"\n' +
          '+\t"group": "1_updated"\n' +
          ' }\n',
      );

      expect(results.data[2].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[2].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(results.data[2].diff).toContain('@@ -2,7 +2,7 @@');
      expect(results.data[2].diff).toContain(
        '-\t"is_removed": false,\n' +
          '+\t"is_removed": true,\n' +
          ' \t"is_preset": true,\n' +
          ' \t"group": "1_updated"\n' +
          ' }\n',
      );

      changelogDashboardId = results.data[0].dashboard_id;
    });

    it('with search filter', async () => {
      const results = await dashboardChangelogService.list(
        { dashboard_id: { value: changelogDashboardId, isFuzzy: true } },
        [{ field: 'create_time', order: 'ASC' }],
        { page: 1, pagesize: 20 },
      );

      expect(results.total).toEqual(1);
      expect(results.offset).toEqual(0);

      expect(results.data[0].diff).toContain('diff --git a/data.json b/data.json');
      expect(results.data[0].diff).toContain('--- a/data.json\n' + '+++ b/data.json');
      expect(results.data[0].diff).toContain('@@ -1,8 +1,8 @@');
      expect(results.data[0].diff).toContain(
        '-\t"name": "dashboard3",\n' +
          '+\t"name": "dashboard3_updated",\n' +
          ' \t"content_id": null,\n' +
          '-\t"is_removed": false,\n' +
          '+\t"is_removed": true,\n' +
          ' \t"is_preset": false,\n' +
          '-\t"group": "2"\n' +
          '+\t"group": "2_updated"\n' +
          ' }\n',
      );
    });
  });
});
