import { dashboardDataSource } from '~/data_sources/dashboard';

export function connectionHook(): void {
  beforeAll(async () => {
    dashboardDataSource.setOptions({ url: process.env.INTEGRATION_TEST_PG_URL! });
    await dashboardDataSource.initialize();
  });
  afterAll(async () => {
    await dashboardDataSource.destroy();
  });
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function sleep(ms: number) {
  await timeout(ms);
}
