import { connectionHook } from './jest.util';
import { DashboardService } from '~/services/dashboard.service';
import Dashboard from '~/models/dashboard';
import { EntityNotFoundError } from 'typeorm';
import { ROLE_TYPES } from '~/api_models/role';
import { ApiError, BAD_REQUEST } from '~/utils/errors';
import { notFoundId } from './constants';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { DEFAULT_LANGUAGE } from '~/utils/constants';
import { omitFields } from '~/utils/helpers';

describe('DashboardService', () => {
  connectionHook();
  let dashboardService: DashboardService;
  let dashboards: Dashboard[];
  let dashboard3: Dashboard;

  beforeAll(async () => {
    dashboardService = new DashboardService();
    dashboards = await dashboardDataSource.manager.find(Dashboard, { order: { name: 'ASC' } });
  });

  describe('create', () => {
    it('should create successfully', async () => {
      dashboard3 = await dashboardService.create('dashboard3', '2', DEFAULT_LANGUAGE);
    });

    it('should fail if duplicate name', async () => {
      await expect(dashboardService.create('dashboard3', '2', DEFAULT_LANGUAGE)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'A dashboard with that name already exists' }),
      );
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const results = await dashboardService.list(undefined, [{ field: 'name', order: 'ASC' }], {
        page: 1,
        pagesize: 20,
      });
      results.data = results.data.map((el) => omitFields(el, ['create_time', 'update_time']));
      expect(results).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: dashboards[0].id,
            name: 'dashboard1',
            content_id: '9afa4842-77ef-4b19-8a53-034cb41ee7f6',
            is_removed: true,
            is_preset: false,
            group: '1',
          },
          {
            id: dashboards[1].id,
            name: 'dashboard2',
            content_id: '5959a66b-5b6b-4509-9d87-bb8b96100658',
            is_removed: false,
            is_preset: true,
            group: '1',
          },
          {
            id: dashboard3.id,
            name: 'dashboard3',
            content_id: null,
            is_removed: false,
            is_preset: false,
            group: '2',
          },
        ],
      });
    });

    it('with filter', async () => {
      const results = await dashboardService.list(
        { group: { value: '2', isFuzzy: true }, name: { value: '3', isFuzzy: true }, is_removed: false },
        [{ field: 'create_time', order: 'ASC' }],
        { page: 1, pagesize: 20 },
      );
      results.data = results.data.map((el) => omitFields(el, ['create_time', 'update_time']));
      expect(results).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: dashboard3.id,
            name: 'dashboard3',
            content_id: null,
            is_removed: false,
            is_preset: false,
            group: '2',
          },
        ],
      });
    });
  });

  describe('get', () => {
    it('should return successfully', async () => {
      const dashboard = await dashboardService.get(dashboard3.id);
      expect(dashboard).toMatchObject(dashboard3);
    });

    it('should fail', async () => {
      await expect(dashboardService.get(notFoundId)).rejects.toThrowError(EntityNotFoundError);
    });
  });

  describe('getByName', () => {
    it('should return successfully', async () => {
      const dashboard = await dashboardService.getByName(dashboard3.name, dashboard3.is_preset);
      expect(dashboard).toMatchObject(dashboard3);
    });

    it('should fail', async () => {
      await expect(dashboardService.getByName(dashboard3.name, !dashboard3.is_preset)).rejects.toThrowError(
        EntityNotFoundError,
      );
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const updatedDashboard = await dashboardService.update(
        dashboard3.id,
        'dashboard3_updated',
        undefined,
        true,
        '2_updated',
        DEFAULT_LANGUAGE,
        ROLE_TYPES.SUPERADMIN,
      );
      expect(omitFields(updatedDashboard, ['create_time', 'update_time'])).toMatchObject({
        ...omitFields(dashboard3, ['create_time', 'update_time']),
        name: 'dashboard3_updated',
        is_removed: true,
        group: '2_updated',
      });
    });

    it('should fail if not found', async () => {
      await expect(
        dashboardService.update(
          notFoundId,
          'xxxx',
          undefined,
          false,
          '2_updated',
          DEFAULT_LANGUAGE,
          ROLE_TYPES.SUPERADMIN,
        ),
      ).rejects.toThrowError(EntityNotFoundError);
    });

    it('should update preset dashboard successfully', async () => {
      const updatedDashboard = await dashboardService.update(
        dashboards[1].id,
        'dashboard2_updated',
        undefined,
        false,
        '1_updated',
        DEFAULT_LANGUAGE,
        ROLE_TYPES.SUPERADMIN,
      );
      expect(omitFields(updatedDashboard, ['create_time', 'update_time'])).toMatchObject({
        ...omitFields(dashboards[1], ['create_time', 'update_time']),
        name: 'dashboard2_updated',
        is_removed: false,
        group: '1_updated',
      });
    });

    it('should fail if not SUPERADMIN', async () => {
      await expect(
        dashboardService.update(
          dashboards[1].id,
          'dashboard2_updated',
          undefined,
          false,
          '1_updated',
          DEFAULT_LANGUAGE,
          ROLE_TYPES.ADMIN,
        ),
      ).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'Only superadmin can edit preset dashboards' }));
    });
  });

  describe('delete', () => {
    it('should delete successfully', async () => {
      const deletedDashboard = await dashboardService.delete(dashboard3.id, DEFAULT_LANGUAGE, ROLE_TYPES.SUPERADMIN);
      expect(omitFields(deletedDashboard, ['create_time', 'update_time'])).toMatchObject({
        ...omitFields(dashboard3, ['create_time', 'update_time']),
        name: 'dashboard3_updated',
        is_removed: true,
        group: '2_updated',
      });
    });

    it('should fail if not found', async () => {
      await expect(dashboardService.delete(notFoundId, DEFAULT_LANGUAGE, ROLE_TYPES.SUPERADMIN)).rejects.toThrowError(
        EntityNotFoundError,
      );
    });

    it('should delete preset dashboard successfully if SUPERADMIN', async () => {
      const deletedDashboard = await dashboardService.delete(dashboards[1].id, DEFAULT_LANGUAGE, ROLE_TYPES.SUPERADMIN);
      expect(omitFields(deletedDashboard, ['create_time', 'update_time'])).toMatchObject({
        ...omitFields(dashboards[1], ['create_time', 'update_time']),
        name: 'dashboard2_updated',
        is_removed: true,
        group: '1_updated',
      });
    });

    it('should fail to delete preset dashboard if not SUPERADMIN', async () => {
      await expect(dashboardService.delete(dashboards[1].id, DEFAULT_LANGUAGE, ROLE_TYPES.ADMIN)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Only superadmin can delete preset dashboards' }),
      );
    });
  });
});
