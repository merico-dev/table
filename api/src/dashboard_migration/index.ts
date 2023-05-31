import { dashboardDataSource } from '../data_sources/dashboard';
import logger from 'npmlog';
import _ from 'lodash';
import { Repository } from 'typeorm';
import DashboardContent from '../models/dashboard_content';
import DashboardContentChangelog from '../models/dashboard_content_changelog';
import { DashboardContentChangelogService } from '../services/dashboard_content_changelog.service';

// NOTE: Keep versions in order
const versions = [
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

async function migrateOneDashboardContent(
  dashboardContent: DashboardContent,
  dashboardContentChangelogRepo: Repository<DashboardContentChangelog>,
  dashboardContentRepo: Repository<DashboardContent>,
) {
  try {
    const version = dashboardContent.content.version as string;
    if (version && !versions.includes(version)) {
      throw new Error(
        `MIGRATION FAILED, dashboard content [${dashboardContent.name}]'s version [${version}] is not migratable`,
      );
    }
    let handler = await findHandler(version);
    while (handler) {
      const originalDashboardContent = _.cloneDeep(dashboardContent);
      dashboardContent.content = handler.main(dashboardContent.content);
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
      logger.info(`MIGRATED ${dashboardContent.id} TO VERSION ${dashboardContent.content.version}`);
      handler = await findHandler(dashboardContent.content.version as string);
    }
  } catch (error) {
    /**
     * NOTE(LETO): happens when dashboard's content is not migratable
     * Skip to provide a chance to fix it
     */
    logger.error(`error migrating dashboard content. ID: ${dashboardContent.id}  name: ${dashboardContent.name}`);
    logger.error(error.message);
  }
}

async function main() {
  logger.info('STARTING MIGRATION OF DASHBOARD CONTENTS');
  try {
    if (!dashboardDataSource.isInitialized) {
      await dashboardDataSource.initialize();
    }
    const dashboardContentChangelogRepo = dashboardDataSource.getRepository(DashboardContentChangelog);
    const dashboardContentRepo = dashboardDataSource.getRepository(DashboardContent);
    const dashboardContents = await dashboardContentRepo.find();

    for (let i = 0; i < dashboardContents.length; i += 1) {
      migrateOneDashboardContent(dashboardContents[i], dashboardContentChangelogRepo, dashboardContentRepo);
    }
  } catch (error) {
    logger.error('error migrating dashboard contents');
    logger.error(error.message);
    process.exit(1);
  }
  logger.info('MIGRATION OF DASHBOARD CONTENTS FINISHED');
}

main();
