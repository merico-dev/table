import { connectionHook } from './jest.util';
import { DashboardService } from '~/services/dashboard.service';
import Dashboard from '~/models/dashboard';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { ROLE_TYPES } from '~/api_models/role';
import { ApiError, BAD_REQUEST } from '~/utils/errors';

describe('DashboardService', () => {
  connectionHook();
  let dashboardService: DashboardService;
  let presetDashboard: Dashboard;
  let dashboard1: Dashboard;
  let dashboard2: Dashboard;

  beforeAll(async () => {
    dashboardService = new DashboardService();
    const presetData = new Dashboard();
    presetData.name = 'preset';
    presetData.content = {};
    presetData.is_preset = true;
    presetData.is_removed = true;
    presetDashboard = await dashboardDataSource.getRepository(Dashboard).save(presetData);
  });

  describe('create', () => {
    it('should create successfully', async () => {
      dashboard1 = await dashboardService.create('dashboard1', {});
      dashboard2 = await dashboardService.create('dashboard2', {});
      await dashboardService.create('dashboard3', {});
    });

    it('should fail if duplicate name', async () => {
      await expect(dashboardService.create('dashboard1', {})).rejects.toThrowError(QueryFailedError);
    });

    it('should fail if name empty', async () => {
      await expect(dashboardService.create(undefined, {})).rejects.toThrowError(QueryFailedError);
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const dashboards = await dashboardService.list(undefined, { field: 'create_time', order: 'ASC' }, { page: 1, pagesize: 20 });
      expect(dashboards).toMatchObject({
        total: 4,
        offset: 0,
        data: [
          {
            id: dashboards.data[0].id,
            name: 'preset',
            content: {},
            create_time: dashboards.data[0].create_time,
            update_time: dashboards.data[0].update_time,
            is_removed: true,
            is_preset: true
          },
          {
            id: dashboards.data[1].id,
            name: 'dashboard1',
            content: {},
            create_time: dashboards.data[1].create_time,
            update_time: dashboards.data[1].update_time,
            is_removed: false,
            is_preset: false
          },
          {
            id: dashboards.data[2].id,
            name: 'dashboard2',
            content: {},
            create_time: dashboards.data[2].create_time,
            update_time: dashboards.data[2].update_time,
            is_removed: false,
            is_preset: false
          },
          {
            id: dashboards.data[3].id,
            name: 'dashboard3',
            content: {},
            create_time: dashboards.data[3].create_time,
            update_time: dashboards.data[3].update_time,
            is_removed: false,
            is_preset: false
          }
        ]
      });
    });

    it('with search filter', async () => {
      const dashboards = await dashboardService.list({ search: 'dashboard' }, { field: 'create_time', order: 'ASC' }, { page: 1, pagesize: 20 });
      expect(dashboards).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: dashboards.data[0].id,
            name: 'dashboard1',
            content: {},
            create_time: dashboards.data[0].create_time,
            update_time: dashboards.data[0].update_time,
            is_removed: false,
            is_preset: false
          },
          {
            id: dashboards.data[1].id,
            name: 'dashboard2',
            content: {},
            create_time: dashboards.data[1].create_time,
            update_time: dashboards.data[1].update_time,
            is_removed: false,
            is_preset: false
          },
          {
            id: dashboards.data[2].id,
            name: 'dashboard3',
            content: {},
            create_time: dashboards.data[2].create_time,
            update_time: dashboards.data[2].update_time,
            is_removed: false,
            is_preset: false
          }
        ]
      });
    });

    it('with selection ALL filter', async () => {
      const dashboards = await dashboardService.list({ selection: 'ALL' }, { field: 'create_time', order: 'ASC' }, { page: 1, pagesize: 20 });
      expect(dashboards).toMatchObject({
        total: 4,
        offset: 0,
        data: [
          {
            id: dashboards.data[0].id,
            name: 'preset',
            content: {},
            create_time: dashboards.data[0].create_time,
            update_time: dashboards.data[0].update_time,
            is_removed: true,
            is_preset: true
          },
          {
            id: dashboards.data[1].id,
            name: 'dashboard1',
            content: {},
            create_time: dashboards.data[1].create_time,
            update_time: dashboards.data[1].update_time,
            is_removed: false,
            is_preset: false
          },
          {
            id: dashboards.data[2].id,
            name: 'dashboard2',
            content: {},
            create_time: dashboards.data[2].create_time,
            update_time: dashboards.data[2].update_time,
            is_removed: false,
            is_preset: false
          },
          {
            id: dashboards.data[3].id,
            name: 'dashboard3',
            content: {},
            create_time: dashboards.data[3].create_time,
            update_time: dashboards.data[3].update_time,
            is_removed: false,
            is_preset: false
          }
        ]
      });
    });

    it('with selection ACTIVE filter', async () => {
      const dashboards = await dashboardService.list({ selection: 'ACTIVE' }, { field: 'create_time', order: 'ASC' }, { page: 1, pagesize: 20 });
      expect(dashboards).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: dashboards.data[0].id,
            name: 'dashboard1',
            content: {},
            create_time: dashboards.data[0].create_time,
            update_time: dashboards.data[0].update_time,
            is_removed: false,
            is_preset: false
          },
          {
            id: dashboards.data[1].id,
            name: 'dashboard2',
            content: {},
            create_time: dashboards.data[1].create_time,
            update_time: dashboards.data[1].update_time,
            is_removed: false,
            is_preset: false
          },
          {
            id: dashboards.data[2].id,
            name: 'dashboard3',
            content: {},
            create_time: dashboards.data[2].create_time,
            update_time: dashboards.data[2].update_time,
            is_removed: false,
            is_preset: false
          }
        ]
      });
    });

    it('with selection REMOVED filter', async () => {
      const dashboards = await dashboardService.list({ selection: 'REMOVED' }, { field: 'create_time', order: 'ASC' }, { page: 1, pagesize: 20 });
      expect(dashboards).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: dashboards.data[0].id,
            name: 'preset',
            content: {},
            create_time: dashboards.data[0].create_time,
            update_time: dashboards.data[0].update_time,
            is_removed: true,
            is_preset: true
          }
        ]
      });
    });
  });

  describe('get', () => {
    it('should return successfully', async () => {
      const dashboard = await dashboardService.get(dashboard1.id);
      expect(dashboard).toMatchObject(dashboard1);
    });

    it('should fail', async () => {
      await expect(dashboardService.get('3e7acce4-b8cd-4c01-b009-d2ea33a07258')).rejects.toThrowError(EntityNotFoundError);
    });
  });

  describe('getByName', () => {
    it('should return successfully', async () => {
      const dashboard = await dashboardService.getByName(dashboard1.name, dashboard1.is_preset);
      expect(dashboard).toMatchObject(dashboard1);
    });

    it('should fail', async () => {
      await expect(dashboardService.getByName(dashboard1.name, !dashboard1.is_preset)).rejects.toThrowError(EntityNotFoundError);
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const updatedDashboard = await dashboardService.update(dashboard1.id, 'dashboard1_updated', {}, true, ROLE_TYPES.SUPERADMIN);
      expect(updatedDashboard).toMatchObject({
        ...dashboard1,
        name: 'dashboard1_updated',
        is_removed: true,
        update_time: updatedDashboard.update_time
      });
      dashboard1 = updatedDashboard;
    });

    it('should fail if not found', async () => {
      await expect(dashboardService.update('3e7acce4-b8cd-4c01-b009-d2ea33a07258', 'xxxx', {}, false, ROLE_TYPES.SUPERADMIN)).rejects.toThrowError(EntityNotFoundError);
    });

    it('should update preset dashboard successfully', async () => {
      const updatedDashboard = await dashboardService.update(presetDashboard.id, 'preset_updated', {}, false, ROLE_TYPES.SUPERADMIN);
      expect(updatedDashboard).toMatchObject({
        ...presetDashboard,
        name: 'preset_updated',
        is_removed: false,
        update_time: updatedDashboard.update_time
      });
      presetDashboard = updatedDashboard;
    });

    it('should fail if not SUPERADMIN', async () => {
      await expect(dashboardService.update(presetDashboard.id, 'preset_updated', {}, false, ROLE_TYPES.ADMIN)).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'Only superadmin can edit preset dashboards' }));
    });
  });

  describe('delete', () => {
    it('should delete successfully', async () => {
      const deletedDashboard = await dashboardService.delete(dashboard2.id, ROLE_TYPES.SUPERADMIN);
      expect(deletedDashboard).toMatchObject({
        ...dashboard2,
        is_removed: true,
        update_time: deletedDashboard.update_time
      });
    });

    it('should fail if not found', async () => {
      await expect(dashboardService.delete('3e7acce4-b8cd-4c01-b009-d2ea33a07258', ROLE_TYPES.SUPERADMIN)).rejects.toThrowError(EntityNotFoundError);
    });

    it ('should delete preset dashboard successfully if SUPERADMIN', async () => {
      const deletedDashboard = await dashboardService.delete(presetDashboard.id, ROLE_TYPES.SUPERADMIN);
      expect(deletedDashboard).toMatchObject({
        ...presetDashboard,
        is_removed: true,
        update_time: deletedDashboard.update_time
      });
      presetDashboard = deletedDashboard;
    });

    it('should fail to delete preset dashboard if not SUPERADMIN', async () => {
      await expect(dashboardService.delete(presetDashboard.id, ROLE_TYPES.ADMIN)).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'Only superadmin can delete preset dashboards' }));
    });
  });
});