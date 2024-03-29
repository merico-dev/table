import { dashboardDataSource } from '../../src/data_sources/dashboard';

module.exports = async (globalConfig) => {
  console.log('-----------  setup integration testing  -----------------');

  process.env.ENABLE_AUTH = '1';
  process.env.WEBSITE_LOGO_URL_ZH = 'WEBSITE_LOGO_URL_ZH';
  process.env.WEBSITE_LOGO_URL_EN = 'WEBSITE_LOGO_URL_EN';
  process.env.WEBSITE_LOGO_JUMP_URL = '/WEBSITE_LOGO_JUMP_URL';
  process.env.WEBSITE_FAVICON_URL = '/WEBSITE_FAVICON_URL';
  process.env.ENABLE_QUERY_PARSER = '1';

  dashboardDataSource.setOptions({ url: process.env.INTEGRATION_TEST_PG_URL! });

  if (!dashboardDataSource.isInitialized) {
    await dashboardDataSource.initialize();
  }

  await dashboardDataSource.dropDatabase();
  console.log(`globalConfig.maxWorkers: ${globalConfig.maxWorkers}`);
};
