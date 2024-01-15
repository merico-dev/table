import { dashboardDataSource } from '../data_sources/dashboard';
import _ from 'lodash';
import DashboardContent from '../models/dashboard_content';
import DashboardContentChangelog from '../models/dashboard_content_changelog';
import { DashboardContentChangelogService } from '../services/dashboard_content_changelog.service';
import log, { LOG_LABELS, LOG_LEVELS } from '../utils/logger';

// NOTE: Keep versions in order
export const versions = [
  '2.0.0',
  '2.1.0',
  '4.5.0',
  '4.5.1',
  '4.5.2',
  '4.5.3',
  '4.10.0',
  '5.9.0',
  '5.9.1',
  '5.9.2',
  '6.7.0',
  '8.38.0',
  '8.56.0',
  '8.57.0',
  '9.11.0',
  '9.19.0',
  '10.41.0',
  '11.0.0',
  // ... future versions
];

function findNextVersion(currentVersion: string | undefined) {
  if (!currentVersion) {
    return versions[0];
  }

  const currentIndex = versions.findIndex((v) => v === currentVersion);
  if (currentIndex < versions.length - 1) {
    return versions[currentIndex + 1];
  }

  return null; // currentVersion is the lastest version
}

async function findHandler(currentVersion: string | undefined) {
  const nextVersion = findNextVersion(currentVersion);
  if (!nextVersion) {
    return;
  }
  return import(`./handlers/${nextVersion}`);
}

export async function migrateOneDashboardContent(dashboardContent: DashboardContent): Promise<boolean> {
  try {
    const version = dashboardContent.content.version as string;
    if (version && !versions.includes(version)) {
      throw new Error(
        `MIGRATION FAILED, dashboard content [${dashboardContent.name}]'s version [${version}] is not migratable`,
      );
    }
    // TODO: skip if current version is the latest version
    let handler = await findHandler(version);
    while (handler) {
      dashboardContent.content = handler.main(dashboardContent.content);
      handler = await findHandler(dashboardContent.content.version as string);
    }
  } catch (error) {
    /**
     * NOTE(LETO): happens when dashboard's content is not migratable
     * Skip to provide a chance to fix it
     */
    log(
      LOG_LEVELS.ERROR,
      LOG_LABELS.DASHBOARD_SCHEMA,
      `error migrating dashboard content. ID: ${dashboardContent.id}  name: ${dashboardContent.name}`,
    );
    log(LOG_LEVELS.ERROR, LOG_LABELS.DASHBOARD_SCHEMA, error.message);
    return false;
  }
  return true;
}

export async function migrateDashboardContents() {
  log(LOG_LEVELS.INFO, LOG_LABELS.DASHBOARD_SCHEMA, 'STARTING MIGRATION OF DASHBOARD CONTENTS');
  try {
    if (!dashboardDataSource.isInitialized) {
      await dashboardDataSource.initialize();
    }
    const dashboardContentChangelogRepo = dashboardDataSource.getRepository(DashboardContentChangelog);
    const dashboardContentRepo = dashboardDataSource.getRepository(DashboardContent);
    const dashboardContents = await dashboardContentRepo.find();

    for (const dashboardContent of dashboardContents) {
      const originalDashboardContent = _.cloneDeep(dashboardContent);
      await migrateOneDashboardContent(dashboardContent);
      const updatedDashboardContent = await dashboardContentRepo.save(dashboardContent);
      const diff = await DashboardContentChangelogService.createChangelog(
        originalDashboardContent,
        _.cloneDeep(updatedDashboardContent),
      );
      if (diff) {
        const changelog = new DashboardContentChangelog();
        changelog.dashboard_content_id = dashboardContent.id;
        changelog.diff = diff;
        await dashboardContentChangelogRepo.save(changelog);
      }
      log(
        LOG_LEVELS.INFO,
        LOG_LABELS.DASHBOARD_SCHEMA,
        `MIGRATED ${dashboardContent.id} TO VERSION ${dashboardContent.content.version}`,
      );
    }
  } catch (error) {
    log(LOG_LEVELS.ERROR, LOG_LABELS.DASHBOARD_SCHEMA, 'error migrating dashboard contents');
    log(LOG_LEVELS.ERROR, LOG_LABELS.DASHBOARD_SCHEMA, error.message);
    process.exit(1);
  }
  log(LOG_LEVELS.ERROR, LOG_LABELS.DASHBOARD_SCHEMA, 'MIGRATION OF DASHBOARD CONTENTS FINISHED');
}
