import * as logger from 'npmlog';

export const enum LOG_LEVELS {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export enum LOG_LABELS {
  SERVER = 'SERVER',
  DASHBOARD_SCHEMA = 'DASHBOARD_SCHEMA',
  API = 'API',
  SERVICE = 'SERVICE',
  AXIOS = 'AXIOS',
  WEBSOCKET = 'WEBSOCKET',
  QUERY_MISMATCH = 'QUERY_MISMATCH',
}

export default function log(level: LOG_LEVELS, label: LOG_LABELS, message: any) {
  logger[level](label, message);
}
