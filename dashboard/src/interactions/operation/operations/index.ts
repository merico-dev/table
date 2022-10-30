import { OpenLink } from '~/interactions/operation/operations/open-link';
import { IDashboardOperationSchema } from '~/types/plugin';
import { ConsoleLog } from './console-log';
import { OpenView } from './open-view';
import { SetFilterValues } from './set-filter-values';

export const OPERATIONS: IDashboardOperationSchema[] = [ConsoleLog, OpenLink, OpenView, SetFilterValues];
