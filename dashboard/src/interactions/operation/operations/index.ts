import { OpenLink } from '~/interactions/operation/operations/open-link';
import { IDashboardOperationSchema } from '~/types/plugin';
import { ConsoleLog } from './console-log';

export const OPERATIONS: IDashboardOperationSchema[] = [ConsoleLog, OpenLink];
