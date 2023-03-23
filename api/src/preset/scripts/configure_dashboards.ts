import { existsSync, readdirSync, readFileSync } from 'fs';
import path from 'path';
import _ from 'lodash';
import { dashboardDataSource } from '../../data_sources/dashboard';
import Dashboard from '../../models/dashboard';
import DataSource from '../../models/datasource';
import { DashboardChangelogService } from '../../services/dashboard_changelog.service';
import DashboardChangelog from '../../models/dashboard_changelog';
import Account from '../../models/account';
import { ROLE_TYPES } from '../../api_models/role';
import DashboardPermission from '../../models/dashboard_permission';

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
      .findOneByOrFail({ role_id: ROLE_TYPES.SUPERADMIN });
    const dashboardChangelogRepo = queryRunner.manager.getRepository(DashboardChangelog);
    const dashboardRepo = queryRunner.manager.getRepository(Dashboard);
    const dashboardPermissionRepo = queryRunner.manager.getRepository(DashboardPermission);
    const datasourceRepo = queryRunner.manager.getRepository(DataSource);

    const basePath = path.join(__dirname, '../dashboards');
    if (!existsSync(basePath)) {
      console.error(
        'folder for preset dashboards not found. Please run the script for getting preset dashboards first',
      );
      process.exit(1);
    }
    let files = readdirSync(basePath);
    files = files.filter((file) => {
      return file.endsWith('.json');
    });
    const dashboardNames = files.map((file) => {
      return file.substring(0, file.lastIndexOf('.'));
    });
    const currentPresetDashboards = await dashboardRepo.findBy({ is_preset: true });

    const removed = currentPresetDashboards.filter((dashboard) => {
      return !dashboardNames.includes(dashboard.name);
    });
    if (removed.length) {
      await dashboardRepo.delete(
        removed.map((r) => {
          return r.id;
        }),
      );
    }

    const errors: { [type: string]: string[] } = {};
    for (let i = 0; i < files.length; i++) {
      const config: Record<string, any> = JSON.parse(readFileSync(path.join(basePath, files[i]), 'utf-8'));
      for (let j = 0; j < config.definition.queries.length; j++) {
        const { type, key } = config.definition.queries[j] as Source;
        const exists = await datasourceRepo.findOneBy({ type, key, is_preset: true });
        if (!exists) {
          accumulateErrors(errors, type, key);
        }
      }
      const name = dashboardNames[i];
      let dashboard = await dashboardRepo.findOneBy({ name, is_preset: true });
      const originalDashboard: Dashboard | null = _.cloneDeep(dashboard);
      let isNew = false;
      if (!dashboard) {
        dashboard = new Dashboard();
        dashboard.name = name;
        dashboard.is_preset = true;
        isNew = true;
      }
      dashboard.content = config;
      const createdDashboard = await dashboardRepo.save(dashboard);
      if (isNew) {
        const dashboardPermission = new DashboardPermission();
        dashboardPermission.id = createdDashboard.id;
        dashboardPermission.owner_id = superadmin.id;
        dashboardPermission.owner_type = 'ACCOUNT';
        await dashboardPermissionRepo.save(dashboardPermission);
      }
      if (originalDashboard) {
        const diff = await DashboardChangelogService.createChangelog(originalDashboard, _.cloneDeep(dashboard));
        if (diff) {
          const changelog = new DashboardChangelog();
          changelog.dashboard_id = originalDashboard.id;
          changelog.diff = diff;
          await dashboardChangelogRepo.save(changelog);
        }
      }
    }
    if (!_.isEmpty(errors)) {
      throw { message: `Missing preset datasources: ${JSON.stringify(errors)}` };
    }
    await queryRunner.commitTransaction();
    console.log('Finished upserting preset dashboards');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Error upserting preset dashboards:', error);
  } finally {
    await queryRunner.release();
    await dashboardDataSource.destroy();
  }
}

function accumulateErrors(errors: { [type: string]: string[] }, type: string, key: string) {
  if (!errors[type]) {
    errors[type] = [];
  }
  if (!errors[type].includes(key)) {
    errors[type].push(key);
  }
}

upsert();
