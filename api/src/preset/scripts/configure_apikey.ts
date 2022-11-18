import { ROLE_TYPES } from '../../api_models/role';
import { dashboardDataSource } from '../../data_sources/dashboard';
import ApiKey from '../../models/apiKey';
import { PRESET_API_KEY_NAME } from '../../utils/constants';

async function upsert() {
  console.info('Starting upsert of preset apikey');
  const app_id: string | undefined = process.env.PRESET_API_KEY_APP_ID;
  const app_secret: string | undefined = process.env.PRESET_API_KEY_APP_SECRET;
  const role_id: number = parseInt(process.env.PRESET_API_KEY_ROLE_ID!);
  if (!app_id || !app_secret) {
    console.error('Must configure PRESET_API_KEY_APP_ID and PRESET_API_KEY_APP_SECRET in .env');
    process.exit(1);
  }
  if (!(role_id in ROLE_TYPES)) {
    console.error('PRESET_ROLE_ID must be one of:', Object.values(ROLE_TYPES).filter((x) => typeof x === 'string').map((x) => ({ [ROLE_TYPES[x]]: x })));
    process.exit(1);
  }
  try {
    if (!dashboardDataSource.isInitialized) {
      await dashboardDataSource.initialize();
    }
    let apikey: ApiKey | null;
    const apikeyRepo = dashboardDataSource.getRepository(ApiKey);
    apikey = await apikeyRepo.findOneBy({ name: PRESET_API_KEY_NAME });
    if (!apikey) {
      apikey = new ApiKey();
      apikey.name = PRESET_API_KEY_NAME;
    }
    apikey.app_id = app_id;
    apikey.app_secret = app_secret;
    apikey.role_id = role_id;
    await apikeyRepo.save(apikey);
    console.info('Finished upsert of preset apikey');
  } catch (error) {
    console.error('Error upserting preset apikey:', error);
  } finally {
    await dashboardDataSource.destroy();
  }
}

upsert();