import { Container, interfaces } from 'inversify';
import { DashboardService } from './dashboard.service';
import { QueryService } from './query.service';
import { DataSourceService } from './datasource.service';
import { AccountService } from './account.service';
import { RoleService } from './role.service';
import { ApiService } from './api.service';
import { JobService } from './job.service';
import { DashboardChangelogService } from './dashboard_changelog.service';
import { ConfigService } from './config.service';
import { DashboardPermissionService } from './dashboard_permission.service';
import { DashboardContentService } from './dashboard_content.service';
import { DashboardContentChangelogService } from './dashboard_content_changelog.service';

export function bindServices(container: Container) {
  container.bind<interfaces.Newable<JobService>>('Newable<JobService>').toConstructor<JobService>(JobService);
  container
    .bind<interfaces.Newable<DashboardService>>('Newable<DashboardService>')
    .toConstructor<DashboardService>(DashboardService);
  container
    .bind<interfaces.Newable<DataSourceService>>('Newable<DataSourceService>')
    .toConstructor<DataSourceService>(DataSourceService);
  container.bind<interfaces.Newable<QueryService>>('Newable<QueryService>').toConstructor<QueryService>(QueryService);
  container
    .bind<interfaces.Newable<AccountService>>('Newable<AccountService>')
    .toConstructor<AccountService>(AccountService);
  container.bind<interfaces.Newable<RoleService>>('Newable<RoleService>').toConstructor<RoleService>(RoleService);
  container.bind<interfaces.Newable<ApiService>>('Newable<ApiService>').toConstructor<ApiService>(ApiService);
  container
    .bind<interfaces.Newable<DashboardChangelogService>>('Newable<DashboardChangelogService>')
    .toConstructor<DashboardChangelogService>(DashboardChangelogService);
  container
    .bind<interfaces.Newable<ConfigService>>('Newable<ConfigService>')
    .toConstructor<ConfigService>(ConfigService);
  container
    .bind<interfaces.Newable<DashboardPermissionService>>('Newable<DashboardPermissionService>')
    .toConstructor<DashboardPermissionService>(DashboardPermissionService);
  container
    .bind<interfaces.Newable<DashboardContentService>>('Newable<DashboardContentService>')
    .toConstructor<DashboardContentService>(DashboardContentService);
  container
    .bind<interfaces.Newable<DashboardContentChangelogService>>('Newable<DashboardContentChangelogService>')
    .toConstructor<DashboardContentChangelogService>(DashboardContentChangelogService);
}
