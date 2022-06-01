import { IDashboard } from "@devtable/dashboard";
import { normalizeDBDashboard } from "./dashboard.transform";
import { IDBDashboard, PaginationResponse } from "./dashboard.typed";
import { post } from "./request";

export const DashboardAPI = {
  list: async (): Promise<PaginationResponse<IDBDashboard>> => {
    const res = await post('/dashboard/list', {})
    return res;
  },
  details: async (id: string): Promise<IDashboard> => {
    const res = await post('/dashboard/details', { id })
    return normalizeDBDashboard(res);
  }
}