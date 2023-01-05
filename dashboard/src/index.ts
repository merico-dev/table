export const getVersion = () =>
  import('../package.json').then(({ version }) => {
    console.log(`[@devtable/dashboard] version: ${version}`);
    return version;
  });

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
