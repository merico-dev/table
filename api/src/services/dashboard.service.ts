import { PaginationRequest } from '../api_models/base';
import { DashboardFilterObject, DashboardSortObject, DashboardPaginationResponse } from '../api_models/dashboard';
import { dashboardDataSource } from '../data_sources/dashboard';
import Dashboard from '../models/dashboard';
import { escapeLikePattern } from '../utils/helpers';

export class DashboardService {
  async list(filter: DashboardFilterObject | undefined, sort: DashboardSortObject, pagination: PaginationRequest): Promise<DashboardPaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager.createQueryBuilder()
      .from(Dashboard, 'dashboard')
      .orderBy(sort.field, sort.order)
      .offset(offset).limit(pagination.pagesize);

    if (filter !== undefined) {
      if (filter.selection === 'ALL') {
        qb.where('dashboard.is_removed in (true, false)');
      } else if (filter.selection === 'REMOVED') {
        qb.where('dashboard.is_removed = true');
      } else {
        qb.where('dashboard.is_removed = false');
      }
  
      if (filter.search) {
        qb.andWhere('dashboard.name ilike :search', { search: `%${escapeLikePattern(filter.search)}%` });
      }
    }

    const dashboards = await qb.getRawMany<Dashboard>();
    const total = await qb.getCount();

    return {
      total,
      offset,
      data: dashboards,
    };
  }

  async create(name: string, content: Record<string, any>): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    const dashboard = new Dashboard();
    dashboard.name = name;
    dashboard.content = content;
    const result = await dashboardRepo.save(dashboard);
    return result;
  }

  async get(id: string): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    return await dashboardRepo.findOneByOrFail({ id });
  }

  async update(id: string, name: string | undefined, content: Record<string, any> | undefined, is_removed: boolean | undefined): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    const dashboard = await dashboardRepo.findOneByOrFail({ id });
    dashboard.name = name === undefined ? dashboard.name : name;
    dashboard.content = content === undefined ? dashboard.content : content;
    dashboard.is_removed = is_removed === undefined ? dashboard.is_removed : is_removed;
    return await dashboardRepo.save(dashboard);
  }

  async delete(id: string): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    const dashboard = await dashboardRepo.findOneByOrFail({ id });
    dashboard.is_removed = true;
    return await dashboardRepo.save(dashboard);
  }
}