import { dashboardDataSource } from '../../src/data_sources/dashboard';

module.exports = async (globalConfig) => {
  process.env.ENABLE_AUTH = '1';
  console.log('-----------  setup e2e, clean all data before test run  -----------------');
  if (!dashboardDataSource.isInitialized) {
    await dashboardDataSource.initialize();
  }

  await dashboardDataSource.dropDatabase();

  for (let i = 1; i <= globalConfig.maxWorkers; i++) {
    const dbPrefix = process.env.TEST_PG_URL.split('/').pop();
    const workerDatabaseName = `${dbPrefix}_${i}`;
    console.log(`dropping database ${workerDatabaseName}`);
    await dashboardDataSource.query(`DROP DATABASE IF EXISTS ${workerDatabaseName}`);
    await dashboardDataSource.query(`CREATE DATABASE ${workerDatabaseName} TEMPLATE ${dbPrefix}`);
  }
  await dashboardDataSource.destroy();
};
