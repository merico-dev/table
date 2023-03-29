import { Server, Socket } from 'socket.io';
import http from 'http';
import logger from 'npmlog';
import { AUTH_ENABLED, DEFAULT_LANGUAGE } from './constants';
import { AccountService } from '../services/account.service';
import { ApiService } from '../services/api.service';
import { ApiError, FORBIDDEN } from './errors';
import { translate } from './i18n';

export enum CHANNELS {
  DASHBOARD = 'DASHBOARD',
}

export let socket: Server;

export function initWebsocket(server: http.Server, origin: string[]) {
  socket = new Server(server, {
    cors: {
      origin: origin,
    },
    allowEIO3: true,
  });

  socket.use(async (socket, next) => {
    let authenticated = false;
    if (!AUTH_ENABLED) {
      authenticated = true;
    }

    if (!authenticated) {
      const account = await AccountService.getByToken(socket.handshake.auth.account);
      if (account) {
        authenticated = true;
      }
    }

    if (!authenticated) {
      const apiKey = await ApiService.verifyApiKey(socket.handshake.auth.apikey, {});
      if (apiKey) {
        authenticated = true;
      }
    }

    if (authenticated) {
      next();
    } else {
      next(new ApiError(FORBIDDEN, { message: translate('FORBIDDEN', DEFAULT_LANGUAGE) }));
    }
  });

  socket.on('connection', (socket: Socket) => {
    logger.info(`user connected to websocket with id: ${socket.id}`);
  });
}

export function channelBuilder(channel: CHANNELS, params: string[]) {
  return [channel, ...params].join(':');
}

export function socketEmit(channel: string, message: any) {
  socket.emit(channel, message);
}
