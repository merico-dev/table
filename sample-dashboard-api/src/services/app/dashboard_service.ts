import { dashboardDataSource } from './../../data_sources/dashboard';
import Dashboard from '../../models/app/dashboard';
import { DashboardItem } from './dashboard_service.type';
import { FilterRequest, PaginationRequest, PaginationResponse, SortOrder, SortRequest } from './base.type';

export class DashboardService {
    async list(filter: FilterRequest, pagination: PaginationRequest, sort: SortRequest): Promise<PaginationResponse<DashboardItem>> {
        const qb = dashboardDataSource.manager.createQueryBuilder()
            .from(Dashboard, 'dashboard')
            .select([
                'dashboard.id AS id',
                'dashboard.name AS name',
                'dashboard.create_time AS create_time'
            ]).offset(pagination.pagesize * (pagination.page - 1)).limit(pagination.pagesize);

        if (sort && sort.field) {
            qb.orderBy(sort.field, sort.order);
        } else {
            qb.orderBy('dashboard.create_time', 'ASC');
        }
        if (filter && filter.search) {
            qb.where('dashboard.name ilike :search', { search: `%${filter.search}%`});
        }

        const dashboards = await qb.getRawMany<DashboardItem>();
        const count = await qb.getCount();

        return {
            total: count,
            data: dashboards,
            offset: pagination.pagesize * (pagination.page - 1),
        };
    }

    async create(name: string, content: Record<string, unknown>): Promise<Dashboard> {
        const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
        const dashboard = new Dashboard();
        dashboard.name = name;
        dashboard.content = content;
        let result = await dashboardRepo.save(dashboard);
        return result;
    }

    async get(id: string): Promise<Dashboard | null> {
        const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
        let result = await dashboardRepo.findOneBy({ id });
        return result;
    }

    async update(id: string, name: string, content: Record<string, unknown> ): Promise<Dashboard | null> {
        const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
        let result = await dashboardRepo.findOneBy({ id });
        if (result) {
            result.name = name;
            result.content = content;
            return await dashboardRepo.save(result);
        }
        return result;
    }

    async delete(id: string): Promise<Dashboard | null> {
        const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
        let result = await dashboardRepo.findOneBy({ id });
        if (result) {
            result.is_removed = true;
            result = await dashboardRepo.save(result);
        }
        return result;
    }
}