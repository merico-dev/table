import { connectionHook } from './jest.util';
import { DashboardService } from '~/services/dashboard.service';
import Dashboard from '~/models/dashboard';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { ROLE_TYPES } from '~/api_models/role';
import { ApiError, BAD_REQUEST } from '~/utils/errors';
import { notFoundId } from './constants';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { DEFAULT_LANGUAGE } from '~/utils/constants';

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
      dashboard3 = await dashboardService.create('dashboard3', {}, '2');
    });

    it('should fail if duplicate name', async () => {
      await expect(dashboardService.create('dashboard3', {}, '2')).rejects.toThrowError(QueryFailedError);
    });

    it('should fail if name empty', async () => {
      await expect(dashboardService.create(undefined, {}, '2')).rejects.toThrowError(QueryFailedError);
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const results = await dashboardService.list(
        undefined,
        { field: 'name', order: 'ASC' },
        { page: 1, pagesize: 20 },
      );
      expect(results).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: dashboards[0].id,
            name: 'dashboard1',
            content: {
              definition: {
                queries: [
                  {
                    id: 'pgQuery1',
                    type: 'postgresql',
                    key: 'pg',
                  },
                  {
                    id: 'httpQuery1',
                    type: 'http',
                    key: 'jsonplaceholder',
                  },
                ],
              },
            },
            create_time: dashboards[0].create_time,
            update_time: dashboards[0].update_time,
            is_removed: true,
            is_preset: false,
            group: '1',
          },
          {
            id: dashboards[1].id,
            name: 'dashboard2',
            content: {
              definition: {
                queries: [
                  {
                    id: 'pgQuery2',
                    type: 'postgresql',
                    key: 'pg',
                  },
                  {
                    id: 'httpQuery2',
                    type: 'http',
                    key: 'jsonplaceholder',
                  },
                ],
              },
            },
            create_time: dashboards[1].create_time,
            update_time: dashboards[1].update_time,
            is_removed: false,
            is_preset: true,
            group: '1',
          },
          {
            id: dashboard3.id,
            name: 'dashboard3',
            content: {},
            create_time: dashboard3.create_time,
            update_time: dashboard3.update_time,
            is_removed: false,
            is_preset: false,
            group: '2',
          },
        ],
      });
    });

    it('with search filter', async () => {
      const results = await dashboardService.list(
        { search: '3' },
        { field: 'create_time', order: 'ASC' },
        { page: 1, pagesize: 20 },
      );
      expect(results).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: dashboard3.id,
            name: 'dashboard3',
            content: {},
            create_time: dashboard3.create_time,
            update_time: dashboard3.update_time,
            is_removed: false,
            is_preset: false,
            group: '2',
          },
        ],
      });
    });

    it('with selection ALL filter', async () => {
      const results = await dashboardService.list(
        { selection: 'ALL' },
        { field: 'name', order: 'ASC' },
        { page: 1, pagesize: 20 },
      );
      expect(results).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: dashboards[0].id,
            name: 'dashboard1',
            content: {},
            create_time: dashboards[0].create_time,
            update_time: dashboards[0].update_time,
            is_removed: true,
            is_preset: false,
            group: '1',
          },
          {
            id: dashboards[1].id,
            name: 'dashboard2',
            content: {},
            create_time: dashboards[1].create_time,
            update_time: dashboards[1].update_time,
            is_removed: false,
            is_preset: true,
            group: '1',
          },
          {
            id: dashboard3.id,
            name: 'dashboard3',
            content: {},
            create_time: dashboard3.create_time,
            update_time: dashboard3.update_time,
            is_removed: false,
            is_preset: false,
            group: '2',
          },
        ],
      });
    });

    it('with selection ACTIVE filter', async () => {
      const results = await dashboardService.list(
        { selection: 'ACTIVE' },
        { field: 'name', order: 'ASC' },
        { page: 1, pagesize: 20 },
      );
      expect(results).toMatchObject({
        total: 2,
        offset: 0,
        data: [
          {
            id: dashboards[1].id,
            name: 'dashboard2',
            content: {},
            create_time: dashboards[1].create_time,
            update_time: dashboards[1].update_time,
            is_removed: false,
            is_preset: true,
            group: '1',
          },
          {
            id: dashboard3.id,
            name: 'dashboard3',
            content: {},
            create_time: dashboard3.create_time,
            update_time: dashboard3.update_time,
            is_removed: false,
            is_preset: false,
            group: '2',
          },
        ],
      });
    });

    it('with selection REMOVED filter', async () => {
      const results = await dashboardService.list(
        { selection: 'REMOVED' },
        { field: 'create_time', order: 'ASC' },
        { page: 1, pagesize: 20 },
      );
      expect(results).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: dashboards[0].id,
            name: 'dashboard1',
            content: {},
            create_time: dashboards[0].create_time,
            update_time: dashboards[0].update_time,
            is_removed: true,
            is_preset: false,
            group: '1',
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
      expect(updatedDashboard).toMatchObject({
        ...dashboard3,
        name: 'dashboard3_updated',
        is_removed: true,
        group: '2_updated',
        update_time: updatedDashboard.update_time,
      });
    });

    it('should fail if not found', async () => {
      await expect(
        dashboardService.update(notFoundId, 'xxxx', {}, false, '2_updated', DEFAULT_LANGUAGE, ROLE_TYPES.SUPERADMIN),
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
      expect(updatedDashboard).toMatchObject({
        ...dashboards[1],
        name: 'dashboard2_updated',
        is_removed: false,
        group: '1_updated',
        update_time: updatedDashboard.update_time,
      });
    });

    it('should fail if not SUPERADMIN', async () => {
      await expect(
        dashboardService.update(
          dashboards[1].id,
          'dashboard2_updated',
          {},
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
      expect(deletedDashboard).toMatchObject({
        ...dashboard3,
        name: 'dashboard3_updated',
        is_removed: true,
        group: '2_updated',
        update_time: deletedDashboard.update_time,
      });
    });

    it('should fail if not found', async () => {
      await expect(dashboardService.delete(notFoundId, DEFAULT_LANGUAGE, ROLE_TYPES.SUPERADMIN)).rejects.toThrowError(
        EntityNotFoundError,
      );
    });

    it('should delete preset dashboard successfully if SUPERADMIN', async () => {
      const deletedDashboard = await dashboardService.delete(dashboards[1].id, DEFAULT_LANGUAGE, ROLE_TYPES.SUPERADMIN);
      expect(deletedDashboard).toMatchObject({
        ...dashboards[1],
        name: 'dashboard2_updated',
        is_removed: true,
        group: '1_updated',
        update_time: deletedDashboard.update_time,
      });
    });

    it('should fail to delete preset dashboard if not SUPERADMIN', async () => {
      await expect(dashboardService.delete(dashboards[1].id, DEFAULT_LANGUAGE, ROLE_TYPES.ADMIN)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Only superadmin can delete preset dashboards' }),
      );
    });
  });
});
