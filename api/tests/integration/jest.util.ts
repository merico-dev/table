import { omit } from "lodash";
import { dashboardDataSource } from "~/data_sources/dashboard";

export function connectionHook(): void {
  beforeAll(async () => {
    dashboardDataSource.setOptions({ url: process.env.INTEGRATION_TEST_PG_URL! });
    await dashboardDataSource.initialize();
  });
  afterAll(async () => {
    await dashboardDataSource.destroy();
  });
}

export function omitTime(data: any[]): any[] {
  return data.map((x) => { return omit(x, ['create_time', 'update_time']) });
}

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export async function sleep(ms: number) {
  await timeout(ms);
}