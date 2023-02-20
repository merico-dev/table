import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifyDashboardUniqueIndexIsRemoved1676446469234 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX dashboard_name_preset_idx`);

    await queryRunner.query(
      `CREATE UNIQUE INDEX dashboard_name_preset_idx ON dashboard (name, is_preset) WHERE is_removed = false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX dashboard_name_preset_idx`);

    await queryRunner.query(`CREATE UNIQUE INDEX dashboard_name_preset_idx ON dashboard (name, is_preset)`);
  }
}
