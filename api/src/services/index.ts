import { Container } from 'inversify';
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
import { CustomFunctionService } from './custom_function.service';
import { SqlSnippetService } from './sql_snippet.service';

export function bindServices(container: Container) {
  container.bind<JobService>('JobService').to(JobService);
  container.bind<DashboardService>('DashboardService').to(DashboardService);
  container.bind<DataSourceService>('DataSourceService').to(DataSourceService);
  container.bind<QueryService>('QueryService').to(QueryService);
  container.bind<AccountService>('AccountService').to(AccountService);
  container.bind<RoleService>('RoleService').to(RoleService);
  container.bind<ApiService>('ApiService').to(ApiService);
  container.bind<DashboardChangelogService>('DashboardChangelogService').to(DashboardChangelogService);
  container.bind<ConfigService>('ConfigService').to(ConfigService);
  container.bind<DashboardPermissionService>('DashboardPermissionService').to(DashboardPermissionService);
  container.bind<DashboardContentService>('DashboardContentService').to(DashboardContentService);
  container
    .bind<DashboardContentChangelogService>('DashboardContentChangelogService')
    .to(DashboardContentChangelogService);
  container.bind<CustomFunctionService>('CustomFunctionService').to(CustomFunctionService);
  container.bind<SqlSnippetService>('SqlSnippetService').to(SqlSnippetService);
}
