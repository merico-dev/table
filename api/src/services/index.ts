import { Container, interfaces } from 'inversify';
import { DashboardService } from './dashboard.service';
import { QueryService } from './query.service';
import { DataSourceService } from './datasource.service';

export function bindServices(container: Container) {
  container.bind<interfaces.Newable<DashboardService>>("Newable<DashboardService>").toConstructor<DashboardService>(DashboardService);
  container.bind<interfaces.Newable<DataSourceService>>("Newable<DataSourceService>").toConstructor<DataSourceService>(DataSourceService);
  container.bind<interfaces.Newable<QueryService>>("Newable<QueryService>").toConstructor<QueryService>(QueryService);
}