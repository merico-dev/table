export const version = import('../package.json').then((p) => p.version);
console.log(`[@devtable/dashboard] version: ${version}`);

export * from './main';
export * from './view';
export * from './panel';
export * from './contexts';
export * from './types';
export * from './model';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('UTC');
