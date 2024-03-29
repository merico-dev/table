import { dashboardDataSource } from '../../data_sources/dashboard';
import ApiKey from '../../models/apiKey';
import Role from '../../models/role';

async function upsert() {
  console.info('Starting upsert of preset apikey');
  if (!dashboardDataSource.isInitialized) {
    await dashboardDataSource.initialize();
  }
  const queryRunner = dashboardDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const apikeyRepo = queryRunner.manager.getRepository(ApiKey);
    await apikeyRepo.delete({ is_preset: true });

    const { names, app_ids, app_secrets, role_ids } = prepareInputs();

    const roles = await queryRunner.manager.getRepository(Role).find();
    const roleIds = roles.map((role) => role.id);

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const app_id = app_ids[i];
      const app_secret = app_secrets[i];
      const role_id = role_ids[i];

      if (!name || !app_id || !app_secret) {
        console.error(
          'Must configure PRESET_API_KEY_NAME, PRESET_API_KEY_APP_ID and PRESET_API_KEY_APP_SECRET in .env',
        );
        process.exit(1);
      }
      if (!roleIds.includes(role_id)) {
        console.error('PRESET_ROLE_ID must be one of:', roleIds);
        process.exit(1);
      }

      let apikey: ApiKey | null;
      apikey = await apikeyRepo.findOneBy({ name, is_preset: true });
      if (!apikey) {
        apikey = new ApiKey();
        apikey.name = name;
        apikey.is_preset = true;
      }
      apikey.app_id = app_id;
      apikey.app_secret = app_secret;
      apikey.role_id = role_id;
      await apikeyRepo.save(apikey);
    }
    await queryRunner.commitTransaction();
    console.info('Finished upsert of preset apikey');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Error upserting preset apikey:', error);
  } finally {
    await queryRunner.release();
    await dashboardDataSource.destroy();
  }
}

function prepareInputs(): { names: string[]; app_ids: string[]; app_secrets: string[]; role_ids: string[] } {
  const names: string[] = process.env.PRESET_API_KEY_NAME ? process.env.PRESET_API_KEY_NAME.split(';') : [];
  const app_ids: string[] = process.env.PRESET_API_KEY_APP_ID ? process.env.PRESET_API_KEY_APP_ID.split(';') : [];
  const app_secrets: string[] = process.env.PRESET_API_KEY_APP_SECRET
    ? process.env.PRESET_API_KEY_APP_SECRET.split(';')
    : [];
  const role_ids: string[] = process.env.PRESET_API_KEY_ROLE_ID ? process.env.PRESET_API_KEY_ROLE_ID.split(';') : [];

  if (names.length !== app_ids.length || names.length !== app_secrets.length || names.length !== role_ids.length) {
    console.error(
      'Configuration mismatch. Make sure that for each key the name, app_id, app_secret, and role_id are configured',
    );
    process.exit(1);
  }
  return { names, app_ids, app_secrets, role_ids };
}

upsert();
