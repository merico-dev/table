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

type SOCKET_AUTH = { auth_id: string; auth_name: string; auth_type: 'NO_AUTH' | 'ACCOUNT' | 'APIKEY' };
type PRESENCE = Map<string, Record<string, { name: string; connections: Set<string> }>>;
const dashboardEditPresence: PRESENCE = new Map();
const dashboardContentEditPresence: PRESENCE = new Map();

let socket: Server;

export function initWebsocket(server: http.Server, origin: string[]) {
  socket = new Server(server, {
    cors: {
      origin: origin,
    },
    allowEIO3: true,
  });

  socket.use(async (client: Socket, next) => {
    let authenticated = false;
    if (!AUTH_ENABLED) {
      authenticated = true;
      client.handshake.auth.auth = { auth_id: '0', auth_name: 'NO_AUTH', auth_type: 'NO_AUTH' } as SOCKET_AUTH;
    }

    if (!authenticated) {
      const account = await AccountService.getByToken(client.handshake.auth.account);
      if (account) {
        authenticated = true;
        client.handshake.auth.auth = {
          auth_id: account.id,
          auth_name: account.name,
          auth_type: 'ACCOUNT',
        } as SOCKET_AUTH;
      }
    }

    if (!authenticated) {
      const apiKey = await ApiService.verifyApiKey(client.handshake.auth.apikey, {});
      if (apiKey) {
        authenticated = true;
        client.handshake.auth.auth = { auth_id: apiKey.id, auth_name: apiKey.name, auth_type: 'APIKEY' } as SOCKET_AUTH;
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
      const dashboardEditInfos = removePresence(
        dashboardEditPresence,
        client.handshake.auth.auth as SOCKET_AUTH,
        client.id,
      );
      const dashboardContentEditInfos = removePresence(
        dashboardContentEditPresence,
        client.handshake.auth.auth as SOCKET_AUTH,
        client.id,
      );
      for (const data of dashboardEditInfos) {
        socketEmit(channelBuilder(SERVER_CHANNELS.DASHBOARD_EDIT_PRESENCE, [data.id]), parsePresence(data.info));
      }
      for (const data of dashboardContentEditInfos) {
        socketEmit(
          channelBuilder(SERVER_CHANNELS.DASHBOARD_CONTENT_EDIT_PRESENCE, [data.id]),
          parsePresence(data.info),
        );
      }
    });

    client.on(CLIENT_CHANNELS.DASHBOARD_GET_EDIT_PRESENCE, (data: { id: string }) => {
      const result = dashboardEditPresence.get(data.id) ?? {};
      client.emit(channelBuilder(SERVER_CHANNELS.DASHBOARD_EDIT_PRESENCE, [data.id]), parsePresence(result));
    });

    client.on(CLIENT_CHANNELS.DASHBOARD_START_EDIT, (data: { id: string }) => {
      const { id, info } = updatePresence(
        dashboardEditPresence,
        data.id,
        client.handshake.auth.auth as SOCKET_AUTH,
        client.id,
        'ADD',
      );
      socketEmit(channelBuilder(SERVER_CHANNELS.DASHBOARD_EDIT_PRESENCE, [id]), parsePresence(info));
    });

    client.on(CLIENT_CHANNELS.DASHBOARD_END_EDIT, (data: { id: string }) => {
      const { id, info } = updatePresence(
        dashboardEditPresence,
        data.id,
        client.handshake.auth.auth as SOCKET_AUTH,
        client.id,
        'REMOVE',
      );
      socketEmit(channelBuilder(SERVER_CHANNELS.DASHBOARD_EDIT_PRESENCE, [id]), parsePresence(info));
    });

    client.on(CLIENT_CHANNELS.DASHBOARD_CONTENT_GET_EDIT_PRESENCE, (data: { id: string }) => {
      const result = dashboardContentEditPresence.get(data.id) ?? {};
      client.emit(channelBuilder(SERVER_CHANNELS.DASHBOARD_CONTENT_EDIT_PRESENCE, [data.id]), parsePresence(result));
    });

    client.on(CLIENT_CHANNELS.DASHBOARD_CONTENT_START_EDIT, (data: { id: string }) => {
      const { id, info } = updatePresence(
        dashboardContentEditPresence,
        data.id,
        client.handshake.auth.auth as SOCKET_AUTH,
        client.id,
        'ADD',
      );
      socketEmit(channelBuilder(SERVER_CHANNELS.DASHBOARD_CONTENT_EDIT_PRESENCE, [id]), parsePresence(info));
    });

    client.on(CLIENT_CHANNELS.DASHBOARD_CONTENT_END_EDIT, (data: { id: string }) => {
      const { id, info } = updatePresence(
        dashboardContentEditPresence,
        data.id,
        client.handshake.auth.auth as SOCKET_AUTH,
        client.id,
        'REMOVE',
      );
      socketEmit(channelBuilder(SERVER_CHANNELS.DASHBOARD_CONTENT_EDIT_PRESENCE, [id]), parsePresence(info));
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

function parsePresence(presence: Record<string, { name: string; connections: Set<string> }>) {
  const result: Record<string, { name: string; count: number }> = {};
  for (const [key, value] of Object.entries(presence)) {
    result[key] = { name: value.name, count: value.connections.size };
  }
  return result;
}

function updatePresence(
  presence: PRESENCE,
  id: string,
  { auth_id, auth_type, auth_name }: SOCKET_AUTH,
  client_id: string,
  type: 'ADD' | 'REMOVE',
): { id: string; info: Record<string, { name: string; connections: Set<string> }> } {
  const info = presence.get(id) ?? {};
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
  presence.set(id, info);
  return { id, info };
}

function removePresence(
  presence: PRESENCE,
  { auth_id, auth_type, auth_name }: SOCKET_AUTH,
  client_id: string,
): { id: string; info: Record<string, { name: string; connections: Set<string> }> }[] {
  const infos: { id: string; info: Record<string, { name: string; connections: Set<string> }> }[] = [];
  for (const [id, _info] of presence) {
    infos.push(updatePresence(presence, id, { auth_id, auth_type, auth_name }, client_id, 'REMOVE'));
  }
  return infos;
}
