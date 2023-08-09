import bcrypt from 'bcrypt';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { SALT_ROUNDS } from '~/utils/constants';
import {
  accounts,
  apiKeys,
  dataSources,
  dashboards,
  dashboardContents,
  customFunctions,
  sqlSnippets,
} from '../constants';
import Account from '~/models/account';
import ApiKey from '~/models/apiKey';
import DataSource from '~/models/datasource';
import Dashboard from '~/models/dashboard';
import { maybeEncryptPassword } from '~/utils/encryption';
import DashboardPermission from '~/models/dashboard_permission';
import DashboardContent from '~/models/dashboard_content';
import CustomFunction from '~/models/custom_function';
import SqlSnippet from '~/models/sql_snippet';

export async function seed() {
  if (!dashboardDataSource.isInitialized) {
    await dashboardDataSource.initialize();
  }
  await dashboardDataSource.runMigrations({ transaction: 'none' });
  await addAccounts();
  await addApiKeys();
  await addDataSources();
  await addDashboardsAndContent();
  await addCustomFunctions();
  await addSqlSnippets();
}

async function addAccounts() {
  const accountRepo = dashboardDataSource.getRepository(Account);
  await accountRepo.clear();
  for (const account of accounts) {
    account.password = await bcrypt.hash(account.name, SALT_ROUNDS);
    await accountRepo.save(account);
  }
}

async function addApiKeys() {
  const apikeyRepo = dashboardDataSource.getRepository(ApiKey);
  for (const apikey of apiKeys) {
    await apikeyRepo.save(apikey);
  }
}

async function addDataSources() {
  const datasourceRepo = dashboardDataSource.getRepository(DataSource);
  for (const datasource of dataSources) {
    maybeEncryptPassword(datasource.config);
    await datasourceRepo.save(datasource);
  }
}

async function addDashboardsAndContent() {
  const superadmin = accounts[4];
  const author = accounts[2];
  const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
  const dashboardContentRepo = dashboardDataSource.getRepository(DashboardContent);
  const dashboardPermissionRepo = dashboardDataSource.getRepository(DashboardPermission);
  for (let i = 0; i < dashboards.length; i++) {
    const dashboard = dashboards[i];
    await dashboardRepo.save(dashboard);
    const dashboardContent = dashboardContents[i];
    await dashboardContentRepo.save(dashboardContent);
    dashboard.content_id = dashboardContent.id;
    await dashboardRepo.save(dashboard);
    const dashboardPermission = new DashboardPermission();
    dashboardPermission.id = dashboard.id;
    dashboardPermission.owner_id = dashboard.is_preset ? superadmin.id : author.id;
    dashboardPermission.owner_type = 'ACCOUNT';
    await dashboardPermissionRepo.save(dashboardPermission);
  }
}

async function addCustomFunctions() {
  const customFunctionRepo = dashboardDataSource.getRepository(CustomFunction);
  for (const customFunction of customFunctions) {
    await customFunctionRepo.save(customFunction);
  }
}

async function addSqlSnippets() {
  const sqlSnippetRepo = dashboardDataSource.getRepository(SqlSnippet);
  for (const sqlSnippet of sqlSnippets) {
    await sqlSnippetRepo.save(sqlSnippet);
  }
}
