import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifyDataSourcesTable1668738513811 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX data_source_type_key_idx`);

    await queryRunner.query(
      `ALTER TABLE data_source 
          ADD COLUMN is_preset bool NOT NULL DEFAULT false
        `,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX data_source_type_key_preset_idx ON data_source (type, key, is_preset)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX data_source_type_key_preset_idx`);

    await queryRunner.query(
      `ALTER TABLE data_source 
          DROP COLUMN is_preset
        `,
    );

    await queryRunner.query(`CREATE UNIQUE INDEX data_source_type_key_idx ON data_source (type, key)`);
  }
}
