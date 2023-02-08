import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifyApiKeysTable1667547548393 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE api_key`);

    await queryRunner.query(
      `ALTER TABLE api_key
          DROP COLUMN key,
          DROP COLUMN domain,
          ADD COLUMN app_id VARCHAR NOT NULL,
          ADD COLUMN app_secret VARCHAR NOT NULL
        `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE api_key`);

    await queryRunner.query(
      `ALTER TABLE api_key
          DROP COLUMN app_id,
          DROP COLUMN app_secret,
          ADD COLUMN key VARCHAR NOT NULL,
          ADD COLUMN domain VARCHAR NOT NULL
        `,
    );
  }
}
