import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCaseInsensitiveUniqueIndex1767665448973 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing case-sensitive unique indexes
    await queryRunner.query(`DROP INDEX IF EXISTS account_name_idx`);
    await queryRunner.query(`DROP INDEX IF EXISTS account_email_idx`);
    await queryRunner.query(`DROP INDEX IF EXISTS api_key_name_idx`);

    // Create new case-insensitive unique indexes using LOWER()
    await queryRunner.query(`CREATE UNIQUE INDEX account_name_idx ON account (LOWER(name))`);

    // For email, use partial index since email can be NULL
    await queryRunner.query(
      `CREATE UNIQUE INDEX account_email_idx ON account (LOWER(email)) WHERE email IS NOT NULL`,
    );

    await queryRunner.query(`CREATE UNIQUE INDEX api_key_name_idx ON api_key (LOWER(name))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop new case-insensitive indexes
    await queryRunner.query(`DROP INDEX IF EXISTS account_name_idx`);
    await queryRunner.query(`DROP INDEX IF EXISTS account_email_idx`);
    await queryRunner.query(`DROP INDEX IF EXISTS api_key_name_idx`);

    // Restore original case-sensitive indexes
    await queryRunner.query(`CREATE UNIQUE INDEX account_name_idx ON account (name)`);
    await queryRunner.query(`CREATE UNIQUE INDEX account_email_idx ON account (email)`);
    await queryRunner.query(`CREATE UNIQUE INDEX api_key_name_idx ON api_key (name)`);
  }
}
