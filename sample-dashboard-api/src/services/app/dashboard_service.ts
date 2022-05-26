import { dashboardDataSource } from './../../data_sources/dashboard';
import Dashboard from '../../models/app/dashboard';
import { PaginationResponse } from '../../controllers/base.type';
import { DashboardCreateRequest, DashboardListRequest, DashboardIDRequest, DashboardUpdateRequest } from '../../controllers/dashboardController'

export class DashboardService {
  async list(data: DashboardListRequest): Promise<PaginationResponse<Dashboard>> {
    const qb = dashboardDataSource.manager.createQueryBuilder()
      .from(Dashboard, 'dashboard')
      .orderBy(data.sort.field, data.sort.order)
      .offset(data.pagination.pagesize * (data.pagination.page - 1)).limit(data.pagination.pagesize);

    if (data.filter?.selection) {
      if (data.filter.selection === 'ALL') {
        qb.where('dashboard.is_removed in (true, false)');
      }
      if (data.filter.selection === 'REMOVED') {
        qb.where('dashboard.is_removed = true');
      }
    } else {
      qb.where('dashboard.is_removed = false');
    }

    if (data.filter?.search) {
      qb.andWhere('dashboard.name ilike :search', { search: `%${data.filter.search}%`});
    }

    const dashboards = await qb.getRawMany<Dashboard>();
    const count = await qb.getCount();

    return {
      total: count,
      data: dashboards,
      offset: data.pagination.pagesize * (data.pagination.page - 1),
    };
  }

  async create(data: DashboardCreateRequest): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    const dashboard = new Dashboard();
    dashboard.name = data.name;
    dashboard.content = data.content;
    let result = await dashboardRepo.save(dashboard);
    return result;
  }

  async get(data: DashboardIDRequest): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    return await dashboardRepo.findOneByOrFail({ id: data.id });
  }

  async update(data: DashboardUpdateRequest ): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    const dashboard = await dashboardRepo.findOneByOrFail({ id: data.id });
    dashboard.name = data.name === undefined ? dashboard.name : data.name;
    dashboard.content = data.content === undefined ? dashboard.content : data.content;
    dashboard.is_removed = data.is_removed === undefined ? dashboard.is_removed : data.is_removed;
    return await dashboardRepo.save(dashboard);
  }

  async delete(data: DashboardIDRequest): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    const dashboard = await dashboardRepo.findOneByOrFail({ id: data.id });
    dashboard.is_removed = true;
    return await dashboardRepo.save(dashboard);
  }
}