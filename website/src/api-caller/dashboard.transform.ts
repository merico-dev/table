import { IDashboard } from '@devtable/dashboard';
import { IDBDashboard } from './dashboard.typed';

export function normalizeDBDashboard({ id, name, group, content }: IDBDashboard): IDashboard {
  return {
    id,
    name,
    group,
    ...content,
  } as IDashboard;
}
