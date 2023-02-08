import { ArgumentParser } from 'argparse';
import { dashboardDataSource } from '../data_sources/dashboard';
import DataSource from '../models/datasource';
import { JobService, RenameJobParams } from '../services/job.service';

const parser = new ArgumentParser({
  description: 'renameDataSources',
  addHelp: true,
});

parser.addArgument('--type', { help: 'datasource type', required: true });
parser.addArgument('--current-key', { help: 'datasource current key', required: true });
parser.addArgument('--new-key', { help: 'datasource new key', required: true });

const args = parser.parseArgs();

if (args.current_key === args.new_key) {
  console.error('--current-key and --new-key are identical. Exiting...');
  process.exit();
}

async function rename() {
  if (!dashboardDataSource.isInitialized) {
    await dashboardDataSource.initialize();
  }
  try {
    await dashboardDataSource.manager.findOneByOrFail(DataSource, { type: args.type, key: args.current_key });
    const jobParams: RenameJobParams = {
      type: args.type,
      old_key: args.current_key,
      new_key: args.new_key,
    };
    JobService.addRenameDataSourceJob(jobParams);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

rename();
