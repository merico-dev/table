import { Container } from 'inversify';
import { interfaces, TYPE } from 'inversify-express-utils';
import { DashboardController } from './dashboard.controller';
import { QueryController } from './query.controller';
import { DataSourceController } from './datasource.controller';
import { AccountController } from './account.controller';
import { RoleController } from './role.controller';
import { APIController } from './api.controller';
import { JobController } from './job.controller';
import { DashboardChangelogController } from './dashboard_changelog.controller';
import { ConfigController } from './config.controller';
import { DashboardPermissionController } from './dashboard_permission.controller';
import { DashboardContentController } from './dashboard_content.controller';
import { DashboardContentChangelogController } from './dashboard_content_changelog.controller';
import { CustomFunctionController } from './custom_function.controller';
import { SqlSnippetController } from './sql_snippet.controller';

export function bindControllers(container: Container) {
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(DashboardController)
    .inSingletonScope()
    .whenTargetNamed(DashboardController.TARGET_NAME);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(DataSourceController)
    .inSingletonScope()
    .whenTargetNamed(DataSourceController.TARGET_NAME);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(QueryController)
    .inSingletonScope()
    .whenTargetNamed(QueryController.TARGET_NAME);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(AccountController)
    .inSingletonScope()
    .whenTargetNamed(AccountController.TARGET_NAME);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(RoleController)
    .inSingletonScope()
    .whenTargetNamed(RoleController.TARGET_NAME);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(APIController)
    .inSingletonScope()
    .whenTargetNamed(APIController.TARGET_NAME);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(JobController)
    .inSingletonScope()
    .whenTargetNamed(JobController.TARGET_NAME);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(DashboardChangelogController)
    .inSingletonScope()
    .whenTargetNamed(DashboardChangelogController.TARGET_NAME);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(ConfigController)
    .inSingletonScope()
    .whenTargetNamed(ConfigController.TARGET_NAME);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(DashboardPermissionController)
    .inSingletonScope()
    .whenTargetNamed(DashboardPermissionController.TARGET_NAME);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(DashboardContentController)
    .inSingletonScope()
    .whenTargetNamed(DashboardContentController.TARGET_NAME);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(DashboardContentChangelogController)
    .inSingletonScope()
    .whenTargetNamed(DashboardContentChangelogController.TARGET_NAME);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(CustomFunctionController)
    .inSingletonScope()
    .whenTargetNamed(CustomFunctionController.TARGET_NAME);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(SqlSnippetController)
    .inSingletonScope()
    .whenTargetNamed(SqlSnippetController.TARGET_NAME);
}
