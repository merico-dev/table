import { IDashboard } from "@devtable/dashboard";
import { IDBDashboard } from "./dashboard.typed";

export function normalizeDBDashboard({ id, name, content }: IDBDashboard): IDashboard {
  return {
    id,
    name,
    ...content,
  } as IDashboard
}
