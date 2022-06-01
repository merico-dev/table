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
  },
  update: async ({ id, name, definition, panels }: IDashboard): Promise<IDashboard> => {
    const payload = {
      id,
      name,
      content: {
        definition,
        panels,
      }
    };
    const res: IDBDashboard = await post('/dashboard/update', payload);
    return normalizeDBDashboard(res);
  },
  create: async (name: string): Promise<IDashboard> => {
    const payload = {
      name,
      content: {
        definition: {
          sqlSnippets: [],
        },
        panels: [],
      },
    }
    const res: IDBDashboard = await post('/dashboard/create', payload);
    return normalizeDBDashboard(res);
  }
}