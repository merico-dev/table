import { IDashboard } from '@devtable/dashboard';
import { TDashboardMetaInfo } from './dashboard.typed';

export function normalizeDBDashboard({ id, name, group, content_id }: TDashboardMetaInfo): IDashboard {
  return {
    id,
    name,
    group,
    content_id,
  } as IDashboard;
}
