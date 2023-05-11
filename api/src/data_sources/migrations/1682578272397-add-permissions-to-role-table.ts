import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPermissionsToRoleTable1682578272397 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE role SET permissions = 
        jsonb_build_array(
          '[dashboard]view',
          '[account]login',
          '[account]update',
          '[account]changepassword',
          '[config]set-lang',
          '[config]get-website_settings') 
      WHERE id = 'READER'
    `);

    await queryRunner.query(`
      UPDATE role SET permissions = 
        jsonb_build_array(
          '[datasource]view',
          '[dashboard]view',
          '[dashboard]manage',
          '[account]login',
          '[account]list',
          '[account]update',
          '[account]changepassword',
          '[apikey]list',
          '[config]set-lang',
          '[config]get-website_settings')
      WHERE id = 'AUTHOR'
    `);

    await queryRunner.query(`
      UPDATE role SET permissions = 
        jsonb_build_array(
          '[datasource]view',
          '[datasource]manage',
          '[dashboard]view',
          '[dashboard]manage',
          '[account]login',
          '[account]list',
          '[account]update',
          '[account]changepassword',
          '[account]manage',
          '[apikey]list',
          '[apikey]manage',
          '[config]set-lang',
          '[config]get-website_settings',
          '[config]set-website_settings',
          '[role]manage')
      WHERE id = 'ADMIN'
    `);

    await queryRunner.query(`
      UPDATE role SET permissions = 
        jsonb_build_array(
          '[datasource]view',
          '[datasource]manage',
          '[dashboard]view',
          '[dashboard]manage',
          '[account]login',
          '[account]list',
          '[account]update',
          '[account]changepassword',
          '[account]manage',
          '[apikey]list',
          '[apikey]manage',
          '[config]set-lang',
          '[config]get-website_settings',
          '[config]set-website_settings',
          '[role]manage',
          '[preset]')
      WHERE id = 'SUPERADMIN'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE role SET permissions = '[]' WHERE id = ANY('{READER,AUTHOR,ADMIN,SUPERADMIN}')`);
  }
}
