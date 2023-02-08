import * as express from 'express';
import { ConfigService } from '../services/config.service';

export default async function localization(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.headers['accept-language'] === undefined && req.body.auth) {
    const configService = new ConfigService();
    const langConfig = await configService.get('lang', req.body.auth);
    req.locale = langConfig.value;
  }
  next();
}
