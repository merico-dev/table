import { OpenLink } from '~/interactions/operation/operations/open-link';
import { IDashboardOperationSchema } from '~/types/plugin';
import { ConsoleLog } from './console-log';
import { OpenView } from './open-view';
import { SetFilterValues } from './set-filter-values';
import { ClearFilterValues } from './clear-filter-values';
import { ScrollToPanel } from './scroll-to-panel';
import { SwitchTab } from './switch-tab';

export const OPERATIONS: IDashboardOperationSchema[] = [
  ConsoleLog,
  OpenLink,
  OpenView,
  ScrollToPanel,
  SetFilterValues,
  SwitchTab,
  ClearFilterValues,
];
