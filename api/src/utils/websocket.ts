import { Server, Socket } from 'socket.io';
import http from 'http';
import logger from 'npmlog';
import { AUTH_ENABLED, DEFAULT_LANGUAGE } from './constants';
import { AccountService } from '../services/account.service';
import { ApiService } from '../services/api.service';
import { ApiError, FORBIDDEN } from './errors';
import { translate } from './i18n';

export enum SERVER_CHANNELS {
  DASHBOARD = 'DASHBOARD',
  DASHBOARD_EDIT_PRESENCE = 'DASHBOARD_EDIT_PRESENCE',
  DASHBOARD_CONTENT = 'DASHBOARD_CONTENT',
  DASHBOARD_CONTENT_EDIT_PRESENCE = 'DASHBOARD_CONTENT_EDIT_PRESENCE',
}

enum CLIENT_CHANNELS {
  DASHBOARD_GET_EDIT_PRESENCE = 'DASHBOARD_GET_EDIT_PRESENCE',
  DASHBOARD_START_EDIT = 'DASHBOARD_START_EDIT',
  DASHBOARD_END_EDIT = 'DASHBOARD_END_EDIT',
  DASHBOARD_CONTENT_GET_EDIT_PRESENCE = 'DASHBOARD_CONTENT_GET_EDIT_PRESENCE',
  DASHBOARD_CONTENT_START_EDIT = 'DASHBOARD_CONTENT_START_EDIT',
  DASHBOARD_CONTENT_END_EDIT = 'DASHBOARD_CONTENT_END_EDIT',
}

let socket: Server;

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
      socket.handshake.auth.auth = { id: '0', name: 'NO_AUTH', type: 'NO_AUTH' };
    }

    if (!authenticated) {
      const account = await AccountService.getByToken(socket.handshake.auth.account);
      if (account) {
        authenticated = true;
        socket.handshake.auth.auth = { id: account.id, name: account.name, type: 'ACCOUNT' };
      }
    }

    if (!authenticated) {
      const apiKey = await ApiService.verifyApiKey(socket.handshake.auth.apikey, {});
      if (apiKey) {
        authenticated = true;
        socket.handshake.auth.auth = { id: apiKey.id, name: apiKey.name, type: 'APIKEY' };
      }
    }

    if (authenticated) {
      next();
    } else {
      next(new ApiError(FORBIDDEN, { message: translate('FORBIDDEN', DEFAULT_LANGUAGE) }));
    }
  });

  socket.engine.on('connection_error', (err) => {
    const msg = `EngineIO connection error, code: ${err.code}, message: ${err.message}`;
    logger.error(msg);
    logger.info(JSON.stringify(err.context, null, 2));
  });

  socket.on('connection', (client: Socket) => {
    logger.info(`user connected to websocket with id: ${client.id}`);

    client.on('disconnect', () => {
      logger.info(`user disconnected from websocket with id: ${client.id}`);
      removeDashboardEditPresence(
        client.handshake.auth.auth.id,
        client.handshake.auth.auth.type,
        client.handshake.auth.auth.name,
        client.id,
      );
      removeDashboardContentEditPresence(client.handshake.auth.auth.id, client.handshake.auth.auth.type, client.id);
    });

    client.on(CLIENT_CHANNELS.DASHBOARD_GET_EDIT_PRESENCE, (data: { id: string }) => {
      const result = dashboardEditPresence.get(data.id) ?? {};
      client.emit(channelBuilder(SERVER_CHANNELS.DASHBOARD_EDIT_PRESENCE, [data.id]), parsePresence(result));
    });

    client.on(CLIENT_CHANNELS.DASHBOARD_START_EDIT, (data: { id: string }) => {
      updateDashboardEditPresence(
        data.id,
        client.handshake.auth.auth.id,
        client.handshake.auth.auth.type,
        client.handshake.auth.auth.name,
        client.id,
        'ADD',
      );
    });

    client.on(CLIENT_CHANNELS.DASHBOARD_END_EDIT, (data: { id: string }) => {
      updateDashboardEditPresence(
        data.id,
        client.handshake.auth.auth.id,
        client.handshake.auth.auth.type,
        client.handshake.auth.auth.name,
        client.id,
        'REMOVE',
      );
    });

    client.on(CLIENT_CHANNELS.DASHBOARD_CONTENT_GET_EDIT_PRESENCE, (data: { id: string }) => {
      const result = dashboardContentEditPresence.get(data.id) ?? {};
      client.emit(channelBuilder(SERVER_CHANNELS.DASHBOARD_CONTENT_EDIT_PRESENCE, [data.id]), parsePresence(result));
    });

    client.on(CLIENT_CHANNELS.DASHBOARD_CONTENT_START_EDIT, (data: { id: string }) => {
      updateDashboardContentEditPresence(
        data.id,
        client.handshake.auth.auth.id,
        client.handshake.auth.auth.type,
        client.id,
        'ADD',
      );
    });

    client.on(CLIENT_CHANNELS.DASHBOARD_CONTENT_END_EDIT, (data: { id: string }) => {
      updateDashboardContentEditPresence(
        data.id,
        client.handshake.auth.auth.id,
        client.handshake.auth.auth.type,
        client.id,
        'REMOVE',
      );
    });
  });
}

export function channelBuilder(channel: SERVER_CHANNELS | CLIENT_CHANNELS, params: string[]) {
  return [channel, ...params].join(':');
}

export function socketEmit(channel: string, message: any) {
  if (socket) {
    socket.emit(channel, message);
  }
}

function getPresenceAuthKey(auth_id: string, auth_type: string) {
  return `${auth_id}:${auth_type}`;
}

function parsePresence(presence: Record<string, Set<string>>) {
  const result: Record<string, number> = {};
  for (const [key, value] of Object.entries(presence)) {
    result[key] = value.size;
  }
  return result;
}

const dashboardEditPresence = new Map<string, Record<string, { name: string; connections: Set<string> }>>();
function updateDashboardEditPresence(
  id: string,
  auth_id: string,
  auth_type: string,
  auth_name: string,
  client_id: string,
  type: 'ADD' | 'REMOVE',
) {
  const info = dashboardEditPresence.get(id) ?? {};
  const authKey = getPresenceAuthKey(auth_id, auth_type);
  if (type === 'ADD') {
    info[authKey] = info[authKey] ?? { name: auth_name, connections: new Set() };
    info[authKey].connections.add(client_id);
  } else {
    if (info[authKey]) {
      info[authKey].connections.delete(client_id);
      if (info[authKey].connections.size === 0) {
        delete info[authKey];
      }
    }
  }
  dashboardEditPresence.set(id, info);
  socketEmit(channelBuilder(SERVER_CHANNELS.DASHBOARD_EDIT_PRESENCE, [id]), parsePresence(info));
}
function removeDashboardEditPresence(auth_id: string, auth_type: string, auth_name: string, client_id: string) {
  for (const [id, _info] of dashboardEditPresence) {
    updateDashboardEditPresence(id, auth_id, auth_type, auth_name, client_id, 'REMOVE');
  }
}
function parseDashboardPresence(presence: Record<string, { name: string; connections: Set<string> }>) {
  const result: Record<string, { name: string; count: number }> = {};
  for (const [key, value] of Object.entries(presence)) {
    result[key] = { name: value.name, count: value.connections.size };
  }
}
