import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifyApiKeysTable1668750118317 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX api_key_name_idx`);

    await queryRunner.query(
      `ALTER TABLE api_key 
          ADD COLUMN is_preset bool NOT NULL DEFAULT false
        `,
    );

    await queryRunner.query(`CREATE UNIQUE INDEX api_key_name_preset_idx ON api_key (name, is_preset)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX api_key_name_preset_idx`);

    await queryRunner.query(
      `ALTER TABLE api_key 
          DROP COLUMN is_preset
        `,
    );

    await queryRunner.query(`CREATE UNIQUE INDEX api_key_name_idx ON api_key (name)`);
  }
}
