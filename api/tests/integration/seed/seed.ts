import bcrypt from 'bcrypt';
import { dashboardDataSource } from '../../../src/data_sources/dashboard';
import { SALT_ROUNDS } from '../../../src/utils/constants';
import { accounts, apiKeys, dataSources, dashboards } from '../constants';
import Account from '../../../src/models/account';
import ApiKey from '../../../src/models/apiKey';
import DataSource from '../../../src/models/datasource';
import Dashboard from '../../../src/models/dashboard';
import { maybeEncryptPassword } from '../../../src/utils/encryption';

export async function seed() {
  if (!dashboardDataSource.isInitialized) {
    await dashboardDataSource.initialize();
  }
  await dashboardDataSource.runMigrations({ transaction: 'none' });
  await addAccounts();
  await addApiKeys();
  await addDataSources();
  await addDashboards();
}

async function addAccounts() {
  const accountRepo = dashboardDataSource.getRepository(Account);
  await accountRepo.clear();
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    account.password = await bcrypt.hash(account.name, SALT_ROUNDS);
    await accountRepo.save(account);
  }
}

async function addApiKeys() {
  const apikeyRepo = dashboardDataSource.getRepository(ApiKey);
  for (let i = 0; i < apiKeys.length; i++) {
    const apikey = apiKeys[i];
    await apikeyRepo.save(apikey);
  }
}

async function addDataSources() {
  const datasourceRepo = dashboardDataSource.getRepository(DataSource);
  for (let i = 0; i < dataSources.length; i++) {
    const datasource = dataSources[i];
    maybeEncryptPassword(datasource.config);
    await datasourceRepo.save(datasource);
  }
}

async function addDashboards() {
  const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
  for (let i = 0; i < dashboards.length; i++) {
    const dashboard = dashboards[i];
    await dashboardRepo.save(dashboard);
  }
}
