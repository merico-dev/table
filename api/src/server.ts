import 'reflect-metadata';
import * as bodyparser from 'body-parser';
import * as express from 'express';
import * as swagger from 'swagger-express-ts';
import http from 'http';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import authorizationMiddleware from './middleware/authorization';
import errorMiddleware from './middleware/error';
import { bindControllers } from './controller';
import { bindServices } from './services';
import { dashboardDataSource } from './data_sources/dashboard';
import i18n from './utils/i18n';
import localization from './middleware/localization';
import './api_models';
import { initWebsocket } from './utils/websocket';
import { RoleService } from './services/role.service';
import { migrateDashboardContents } from './dashboard_migration';
import log, { LOG_LABELS, LOG_LEVELS } from './utils/logger';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const corsOrigins = process.env.CORS_ALLOW_ORIGIN ? process.env.CORS_ALLOW_ORIGIN.split(';') : ['http://localhost'];
const requestMaxSize = process.env.EXPRESS_REQUEST_MAX_SIZE ?? '1mb';

const container = new Container();

bindControllers(container);
bindServices(container);

const server = new InversifyExpressServer(container);
server.setConfig((application: any) => {
  application.use(express.json({ limit: requestMaxSize }));
  application.use(bodyparser.json());
  application.use(morgan('[:date[clf]] :method :url :status :res[content-length] - :response-time ms'));
  application.use(
    cors({
      origin: process.env.CORS_ALLOW_ORIGIN === '*' ? '*' : corsOrigins,
    }),
  );
  application.use(i18n.init);
  application.use(authorizationMiddleware);
  application.use(localization);
  application.use('/api-docs/swagger', express.static('swagger'));
  application.use('/api-docs/swagger/assets', express.static('swagger/assets'));

  application.get('/ping', (req: express.Request, res: express.Response) => {
    res.send('pong 1');
  });

  application.get('/version', (req: express.Request, res: express.Response) => {
    res.send(process.env.npm_package_version);
  });
  application.use(
    swagger.express({
      definition: {
        info: {
          title: 'Dashboard API',
          version: '1.0.0',
        },
      },
    }),
  );
});
server.setErrorConfig((application: any) => {
  application.use(errorMiddleware);
});

const serverBuild = server.build();
export const app = http.createServer(serverBuild);

const port = process.env.SERVER_PORT || 31200;

if (process.env.NODE_ENV !== 'test') {
  (async function init() {
    app.listen(port, () => {
      log(LOG_LEVELS.INFO, LOG_LABELS.SERVER, `Listening on port ${port}`);
    });

    process.on('uncaughtException', (err) => {
      log(LOG_LEVELS.ERROR, LOG_LABELS.SERVER, err.message);
    });

    await dashboardDataSource.initialize();
    await migrateDashboardContents();

    await RoleService.ensureFixedRolePermissions();

    initWebsocket(app, corsOrigins);
  })();
}
