import { Container } from "inversify";
import { interfaces, TYPE } from 'inversify-express-utils';
import { DashboardController } from "./dashboard.controller";
import { QueryController } from "./query.controller";

export function bindControllers(container: Container) {
  container.bind<interfaces.Controller>(TYPE.Controller).to(DashboardController).inSingletonScope().whenTargetNamed(DashboardController.TARGET_NAME);
  container.bind<interfaces.Controller>(TYPE.Controller).to(QueryController).inSingletonScope().whenTargetNamed(QueryController.TARGET_NAME);
}