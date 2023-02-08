import path from 'path';
import { existsSync, mkdirSync, rmSync } from 'fs';
import simpleGit from 'simple-git';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

async function get() {
  console.info('Starting download of preset dashboards');
  try {
    const basePath = path.join(__dirname, '../dashboards');
    if (existsSync(basePath)) {
      rmSync(basePath, { recursive: true, force: true });
    }
    mkdirSync(basePath);
    const gitUrl = process.env.PRESET_DASHBOARDS_REPO;
    if (!gitUrl) {
      console.error('repository url has not been configured. Please add PRESET_DASHBOARDS_REPO to .env');
      process.exit(1);
    }
    await simpleGit().clone(gitUrl, basePath);
    console.info('Finished downloading preset dashboards');
  } catch (error) {
    console.error('Error downloading preset dashboards:', error);
  }
}

get();
