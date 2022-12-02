import { dashboardDataSource } from '../../src/data_sources/dashboard';

module.exports = async (globalConfig) => {
  console.log('-----------  setup integration testing  -----------------');
  dashboardDataSource.setOptions({ url: process.env.INTEGRATION_TEST_PG_URL! });

  if (!dashboardDataSource.isInitialized) {
    await dashboardDataSource.initialize();
  }
  await dashboardDataSource.dropDatabase();
  console.log(`globalConfig.maxWorkers: ${globalConfig.maxWorkers}`);
};
