import { existsSync, mkdirSync, readdirSync, readFileSync } from 'fs';
import path from 'path';
import { Like } from 'typeorm';
import { dashboardDataSource } from '../data_sources/dashboard';
import Dashboard from '../models/dashboard';
import { PRESET_PREFIX } from '../utils/constants';

async function upsert() {
  console.info('Starting upsert of preset dashboards');
  if (!dashboardDataSource.isInitialized) {
    await dashboardDataSource.initialize();
  }
  const queryRunner = dashboardDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const dashboardRepo = queryRunner.manager.getRepository(Dashboard);

    const basePath = path.join(__dirname, '../preset_dashboards');
    if (!existsSync(basePath)) {
      console.error('folder for preset dashboards not found. Please run the script for getting preset dashboards first');
      process.exit(1);
    }
    const files = readdirSync(basePath);
    const dashboardNames = files.map((file) => { return `${PRESET_PREFIX}${file.substring(0, file.lastIndexOf('.'))}` });
    const currentPresetDashboards = await dashboardRepo.findBy({ name: Like(`${PRESET_PREFIX}%`) });

    const removed = currentPresetDashboards.filter((dashboard) => { return !dashboardNames.includes(dashboard.name) });
    if (removed.length) {
      await dashboardRepo.delete(removed.map((r) => { return r.id }));
    }

    for (let i = 0; i < files.length; i++) {
      const config: Record<string, any> = JSON.parse(readFileSync(path.join(basePath, files[i]), 'utf-8'));
      const name = dashboardNames[i];
      let dashboard = await dashboardRepo.findOneBy({ name });
      if (!dashboard) {
        dashboard = new Dashboard();
        dashboard.name = name;
      }
      dashboard.content = config;
      await dashboardRepo.save(dashboard);
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

upsert();