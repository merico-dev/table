import { OpenLink } from '~/interactions/operation/operations/open-link';
import { IDashboardOperationSchema } from '~/types/plugin';
import { ConsoleLog } from './console-log';
import { OpenView } from './open-view';

export const OPERATIONS: IDashboardOperationSchema[] = [ConsoleLog, OpenLink, OpenView];
