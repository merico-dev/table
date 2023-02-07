export interface IDBDashboard {
  id: string;
  name: string;
  group: string;
  content: Record<string, $TSFixMe>;
  create_time: string;
  update_time: string;
  is_removed: boolean;
  is_preset?: boolean;
}
