import { dashboardDataSource } from "~/data_sources/dashboard";

export function connectionHook(): void {
  beforeAll(async () => {
    await dashboardDataSource.initialize();
  });
  afterAll(async () => {
    await dashboardDataSource.destroy();
  });
}