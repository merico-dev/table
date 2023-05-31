import 'reflect-metadata';
import * as bodyparser from 'body-parser';
import * as express from 'express';
import * as swagger from 'swagger-express-ts';
import http from 'http';
import path from 'path';
import cors from 'cors';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import authorizationMiddleware from './middleware/authorization';
import errorMiddleware from './middleware/error';
import logger from 'npmlog';
import { bindControllers } from './controller';
import { bindServices } from './services';
import { dashboardDataSource } from './data_sources/dashboard';
import i18n from './utils/i18n';
import localization from './middleware/localization';
import './api_models';
import { initWebsocket } from './utils/websocket';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const corsOrigins = process.env.CORS_ALLOW_ORIGIN ? process.env.CORS_ALLOW_ORIGIN.split(';') : ['http://localhost'];
const requestMaxSize = process.env.EXPRESS_REQUEST_MAX_SIZE ?? '1mb';

const container = new Container();

bindControllers(container);
bindServices(container);

const server = new InversifyExpressServer(container);
server.setConfig((app: any) => {
  app.use(express.json({ limit: requestMaxSize }));
  app.use(bodyparser.json());
  app.use(
    cors({
      origin: corsOrigins,
    }),
  );
  app.use(i18n.init);
  app.use(authorizationMiddleware);
  app.use(localization);
  app.use('/api-docs/swagger', express.static('swagger'));
  app.use('/api-docs/swagger/assets', express.static('swagger/assets'));

  app.get('/ping', (req: express.Request, res: express.Response) => {
    res.send('pong 1');
  });

  app.get('/version', (req: express.Request, res: express.Response) => {
    res.send(process.env.npm_package_version);
  });
  app.use(
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
server.setErrorConfig((app: any) => {
  app.use(errorMiddleware);
});

const serverBuild = server.build();
export const app = http.createServer(serverBuild);

const port = process.env.SERVER_PORT || 31200;

if (process.env.NODE_ENV !== 'test') {
  (async function init() {
    await dashboardDataSource.initialize();
    require('./dashboard_migration');

    app.listen(port, () => {
      logger.info(`Listening on port ${port}`);
    });

    initWebsocket(app, corsOrigins);

    process.on('uncaughtException', (err) => {
      logger.info(err.message);
    });
  })();
}
