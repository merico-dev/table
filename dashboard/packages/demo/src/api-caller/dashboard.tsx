import { IDBDashboard, PaginationResponse } from "./dashboard.typed";
import { post } from "./request";

export const DashboardAPI = {
  list: async (): Promise<PaginationResponse<IDBDashboard>> => {
    const res = await post('/dashboard/list', {})
    return res;
  }
}