import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifyDashboardTable1668741014704 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE dashboard 
          ADD COLUMN is_preset bool NOT NULL DEFAULT false
        `,
    );

    await queryRunner.query(`CREATE UNIQUE INDEX dashboard_name_preset_idx ON dashboard (name, is_preset)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX dashboard_name_preset_idx`);

    await queryRunner.query(
      `ALTER TABLE dashboard 
          DROP COLUMN is_preset
        `,
    );
  }
}
