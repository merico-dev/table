import { connectionHook } from './jest.util';
import { DashboardService } from '~/services/dashboard.service';
import { DashboardContentService } from '~/services/dashboard_content.service';
import Dashboard from '~/models/dashboard';
import DashboardContent from '~/models/dashboard_content';
import DashboardPermission from '~/models/dashboard_permission';
import { Account } from '~/api_models/account';
import { EntityNotFoundError } from 'typeorm';
import { ApiError, BAD_REQUEST } from '~/utils/errors';
import { notFoundId } from './constants';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { DEFAULT_LANGUAGE } from '~/utils/constants';
import { omitFields } from '~/utils/helpers';
import { AccountService } from '~/services/account.service';
import { versions } from '~/dashboard_migration';

describe('DashboardContentService', () => {
  connectionHook();
  let accountService: AccountService;
  let dashboardService: DashboardService;
  let dashboardContentService: DashboardContentService;
  let dashboardContent1: DashboardContent;
  let dashboardContent2: DashboardContent;
  let dashboardContent3: DashboardContent;
  let tempDashboard: Dashboard;
  let tempPresetDashboardContent: DashboardContent;
  let superadmin: Account;
  let authorAccount: Account;

  beforeAll(async () => {
    accountService = new AccountService();
    dashboardService = new DashboardService();
    dashboardContentService = new DashboardContentService();
    superadmin = (
      await accountService.list(
        { name: { isFuzzy: false, value: 'superadmin' } },
        [{ field: 'create_time', order: 'ASC' }],
        { page: 1, pagesize: 20 },
      )
    ).data[0];
    authorAccount = (
      await accountService.list(
        { name: { isFuzzy: false, value: 'account3' } },
        [{ field: 'create_time', order: 'ASC' }],
        { page: 1, pagesize: 20 },
      )
    ).data[0];

    tempDashboard = await dashboardService.create('tempDashboard', 'dashboard_content', DEFAULT_LANGUAGE, superadmin);

    let tempPresetDashboard = new Dashboard();
    tempPresetDashboard.name = 'tempPresetDashboard';
    tempPresetDashboard.is_preset = true;
    tempPresetDashboard = await dashboardDataSource.manager.save(tempPresetDashboard);

    const tempPresetDashboardPermission: DashboardPermission = new DashboardPermission();
    tempPresetDashboardPermission.owner_id = superadmin.id;
    tempPresetDashboardPermission.owner_type = 'ACCOUNT';
    tempPresetDashboardPermission.id = tempPresetDashboard.id;
    await dashboardDataSource.manager.save(tempPresetDashboardPermission);

    tempPresetDashboardContent = new DashboardContent();
    tempPresetDashboardContent.dashboard_id = tempPresetDashboard.id;
    tempPresetDashboardContent.name = 'tempPresetDashboardContent';
    tempPresetDashboardContent.content = {
      definition: { queries: [], sqlSnippets: [] },
      version: versions[versions.length - 1],
    };
    tempPresetDashboardContent = await dashboardDataSource.manager.save(tempPresetDashboardContent);
  });
  describe('create', () => {
    it('should create successfully', async () => {
      dashboardContent1 = await dashboardContentService.create(
        tempDashboard.id,
        'dashboardContent1',
        { version: versions[versions.length - 1], definition: { queries: [], sqlSnippets: [] } },
        DEFAULT_LANGUAGE,
      );
      dashboardContent2 = await dashboardContentService.create(
        tempDashboard.id,
        'dashboardContent2',
        { version: versions[versions.length - 1], definition: { queries: [], sqlSnippets: [] } },
        DEFAULT_LANGUAGE,
      );
      dashboardContent3 = await dashboardContentService.create(
        tempDashboard.id,
        'dashboardContent3',
        { version: versions[versions.length - 1], definition: { queries: [], sqlSnippets: [] } },
        DEFAULT_LANGUAGE,
      );
    });
    it('should fail if duplicate name', async () => {
      await expect(
        dashboardContentService.create(
          tempDashboard.id,
          'dashboardContent1',
          { version: versions[versions.length - 1], definition: { queries: [], sqlSnippets: [] } },
          DEFAULT_LANGUAGE,
        ),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'A dashboard content with that name already exists' }),
      );
    });
  });
  describe('list', () => {
    it('no filters', async () => {
      const results = await dashboardContentService.list(
        tempDashboard.id,
        undefined,
        [{ field: 'name', order: 'ASC' }],
        {
          page: 1,
          pagesize: 20,
        },
      );
      results.data = results.data.map((el) => omitFields(el, ['create_time', 'update_time']));
      expect(results).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: dashboardContent1.id,
            dashboard_id: tempDashboard.id,
            name: 'dashboardContent1',
            content: { version: versions[versions.length - 1], definition: { queries: [], sqlSnippets: [] } },
          },
          {
            id: dashboardContent2.id,
            dashboard_id: tempDashboard.id,
            name: 'dashboardContent2',
            content: { version: versions[versions.length - 1], definition: { queries: [], sqlSnippets: [] } },
          },
          {
            id: dashboardContent3.id,
            dashboard_id: tempDashboard.id,
            name: 'dashboardContent3',
            content: { version: versions[versions.length - 1], definition: { queries: [], sqlSnippets: [] } },
          },
        ],
      });
    });
    it('with filter', async () => {
      const results = await dashboardContentService.list(
        tempDashboard.id,
        { name: { value: '3', isFuzzy: true } },
        [{ field: 'create_time', order: 'ASC' }],
        { page: 1, pagesize: 20 },
      );
      results.data = results.data.map((el) => omitFields(el, ['create_time', 'update_time']));
      expect(results).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: dashboardContent3.id,
            dashboard_id: tempDashboard.id,
            name: 'dashboardContent3',
            content: { version: versions[versions.length - 1], definition: { queries: [], sqlSnippets: [] } },
          },
        ],
      });
    });
  });
  describe('get', () => {
    it('should return successfully', async () => {
      const dashboardContent = await dashboardContentService.get(dashboardContent1.id);
      expect(dashboardContent).toMatchObject(dashboardContent1);
    });
    it('should fail', async () => {
      await expect(dashboardContentService.get(notFoundId)).rejects.toThrowError(EntityNotFoundError);
    });
  });
  describe('update', () => {
    it('should update successfully', async () => {
      const updatedDashboardContent = await dashboardContentService.update(
        dashboardContent1.id,
        'dashboardContent1_updated',
        undefined,
        DEFAULT_LANGUAGE,
        superadmin,
      );
      expect(omitFields(updatedDashboardContent, ['create_time', 'update_time'])).toMatchObject({
        ...omitFields(dashboardContent1, ['create_time', 'update_time']),
        name: 'dashboardContent1_updated',
      });
    });
    it('should fail if not found', async () => {
      await expect(
        dashboardContentService.update(notFoundId, 'xxxx', undefined, DEFAULT_LANGUAGE, superadmin),
      ).rejects.toThrowError(EntityNotFoundError);
    });
    it('should update preset dashboard content successfully', async () => {
      const updatedDashboardContent = await dashboardContentService.update(
        tempPresetDashboardContent.id,
        'tempPresetDashboardContent_updated',
        undefined,
        DEFAULT_LANGUAGE,
        superadmin,
      );
      expect(omitFields(updatedDashboardContent, ['create_time', 'update_time'])).toMatchObject({
        ...omitFields(tempPresetDashboardContent, ['create_time', 'update_time']),
        name: 'tempPresetDashboardContent_updated',
      });
    });
    it('should fail if not SUPERADMIN', async () => {
      await expect(
        dashboardContentService.update(
          tempPresetDashboardContent.id,
          'tempPresetDashboardContent_updated',
          undefined,
          DEFAULT_LANGUAGE,
          authorAccount,
        ),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Only superadmin can edit preset dashboard contents' }),
      );
    });
  });
  describe('delete', () => {
    it('should delete successfully', async () => {
      await dashboardContentService.delete(dashboardContent1.id, DEFAULT_LANGUAGE, superadmin);
      await dashboardContentService.delete(dashboardContent2.id, DEFAULT_LANGUAGE, superadmin);
      await dashboardContentService.delete(dashboardContent3.id, DEFAULT_LANGUAGE, superadmin);
    });
    it('should fail if not found', async () => {
      await expect(dashboardContentService.delete(notFoundId, DEFAULT_LANGUAGE, superadmin)).rejects.toThrowError(
        EntityNotFoundError,
      );
    });
    it('should fail to delete preset dashboard contents if not SUPERADMIN', async () => {
      await expect(
        dashboardContentService.delete(tempPresetDashboardContent.id, DEFAULT_LANGUAGE, authorAccount),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Only superadmin can delete preset dashboard contents' }),
      );
    });
    it('should delete preset dashboard contents successfully if SUPERADMIN', async () => {
      await dashboardContentService.delete(tempPresetDashboardContent.id, DEFAULT_LANGUAGE, superadmin);
    });
  });
});
