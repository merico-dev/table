import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import _ from 'lodash';
import { dashboardDataSource } from '../../data_sources/dashboard';
import Dashboard from '../../models/dashboard';
import DataSource from '../../models/datasource';
import { DashboardChangelogService } from '../../services/dashboard_changelog.service';
import DashboardChangelog from '../../models/dashboard_changelog';
import Account from '../../models/account';
import DashboardPermission from '../../models/dashboard_permission';
import DashboardContentChangelog from '../../models/dashboard_content_changelog';
import DashboardContent from '../../models/dashboard_content';
import { DashboardContentChangelogService } from '../../services/dashboard_content_changelog.service';
import { FIXED_ROLE_TYPES } from '../../services/role.service';
import { QueryRunner, Repository } from 'typeorm';
import { ensureDirSync } from 'fs-extra';

type Source = {
  type: string;
  key: string;
};

async function upsert() {
  console.info('Starting upsert of preset dashboards');
  if (!dashboardDataSource.isInitialized) {
    await dashboardDataSource.initialize();
  }
  const queryRunner = dashboardDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const superadmin: Account = await queryRunner.manager
      .getRepository(Account)
      .findOneByOrFail({ role_id: FIXED_ROLE_TYPES.SUPERADMIN });
    const dashboardRepo = queryRunner.manager.getRepository(Dashboard);
    const datasourceRepo = queryRunner.manager.getRepository(DataSource);

    const basePath = path.join(__dirname, '../dashboards');
    const { files, dashboardNames } = getFilesAndNames(basePath);
    await purgeRemovedDashboards(dashboardRepo, dashboardNames);

    const errors: { [type: string]: string[] } = {};
    for (let i = 0; i < files.length; i++) {
      const config: Record<string, any> = JSON.parse(readFileSync(path.join(basePath, files[i]), 'utf-8'));
      await checkConfigForErrors(datasourceRepo, config, errors);
      const name = dashboardNames[i];
      await upsertDashboard(queryRunner, name, config, superadmin.id);
    }
    if (!_.isEmpty(errors)) {
      throw new Error(`Missing preset datasources: ${JSON.stringify(errors)}`);
    }
    await queryRunner.commitTransaction();
    console.log(`Finished upserting ${files.length} preset dashboards`);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Error upserting preset dashboards:', error);
  } finally {
    await queryRunner.release();
    await dashboardDataSource.destroy();
  }
}

function getFilesAndNames(basePath: string): { files: string[]; dashboardNames: string[] } {
  ensureDirSync(basePath);
  let files = readdirSync(basePath);
  files = files.filter((file) => {
    return file.endsWith('.json');
  });
  const dashboardNames = files.map((file) => {
    return file.substring(0, file.lastIndexOf('.'));
  });
  return { files, dashboardNames };
}

async function purgeRemovedDashboards(dashboardRepo: Repository<Dashboard>, dashboardNames: string[]) {
  const currentPresetDashboards = await dashboardRepo.findBy({ is_preset: true });

  const removed = currentPresetDashboards.filter((dashboard: Dashboard) => {
    return !dashboardNames.includes(dashboard.name);
  });
  if (removed.length) {
    await dashboardRepo.delete(
      removed.map((r) => {
        return r.id;
      }),
    );
  }
}

async function checkConfigForErrors(
  datasourceRepo: Repository<DataSource>,
  config: Record<string, any>,
  errors: { [type: string]: string[] },
) {
  for (let i = 0; i < config.definition.queries.length; i++) {
    const { type, key } = config.definition.queries[i] as Source;
    if (!(await datasourceRepo.exist({ where: { type, key, is_preset: true } }))) {
      if (!errors[type]) {
        errors[type] = [];
      }
      if (!errors[type].includes(key)) {
        errors[type].push(key);
      }
    }
  }
}

async function upsertDashboard(
  queryRunner: QueryRunner,
  name: string,
  config: Record<string, any>,
  superadminId: string,
) {
  const dashboardChangelogRepo = queryRunner.manager.getRepository(DashboardChangelog);
  const dashboardRepo = queryRunner.manager.getRepository(Dashboard);
  const dashboardContentChangelogRepo = queryRunner.manager.getRepository(DashboardContentChangelog);
  const dashboardContentRepo = queryRunner.manager.getRepository(DashboardContent);
  const dashboardPermissionRepo = queryRunner.manager.getRepository(DashboardPermission);
  let dashboard = await dashboardRepo.findOneBy({ name, is_preset: true });
  const originalDashboard: Dashboard | null = _.cloneDeep(dashboard);
  let isNew = false;
  if (!dashboard) {
    dashboard = new Dashboard();
    dashboard.name = name;
    dashboard.is_preset = true;
    isNew = true;
  }
  dashboard = await dashboardRepo.save(dashboard);
  if (isNew) {
    const dashboardPermission = new DashboardPermission();
    dashboardPermission.id = dashboard.id;
    dashboardPermission.owner_id = superadminId;
    dashboardPermission.owner_type = 'ACCOUNT';
    await dashboardPermissionRepo.save(dashboardPermission);
  }
  let dashboardContent = await dashboardContentRepo.findOneBy({ dashboard_id: dashboard.id });
  const originalDashboardContent: DashboardContent | null = _.cloneDeep(dashboardContent);
  if (!dashboardContent) {
    dashboardContent = new DashboardContent();
    dashboardContent.name = name;
    dashboardContent.dashboard_id = dashboard.id;
  }
  dashboardContent.content = config;
  dashboardContent = await dashboardContentRepo.save(dashboardContent);
  dashboard.content_id = dashboardContent.id;
  dashboard = await dashboardRepo.save(dashboard);
  if (originalDashboard) {
    const diff = await DashboardChangelogService.createChangelog(originalDashboard, _.cloneDeep(dashboard));
    if (diff) {
      const changelog = new DashboardChangelog();
      changelog.dashboard_id = originalDashboard.id;
      changelog.diff = diff;
      await dashboardChangelogRepo.save(changelog);
    }
  }
  if (originalDashboardContent) {
    const diff = await DashboardContentChangelogService.createChangelog(
      originalDashboardContent,
      _.cloneDeep(dashboardContent),
    );
    if (diff) {
      const changelog = new DashboardContentChangelog();
      changelog.dashboard_content_id = originalDashboardContent.id;
      changelog.diff = diff;
      await dashboardContentChangelogRepo.save(changelog);
    }
  }
}

upsert();
