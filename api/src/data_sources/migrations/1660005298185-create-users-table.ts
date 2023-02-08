import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUsersTable1660005298185 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE account
        (
          id uuid NOT NULL DEFAULT gen_random_uuid(),
          name citext NOT NULL,
          email citext DEFAULT NULL,
          password VARCHAR NOT NULL,
          role_id SMALLINT NOT NULL DEFAULT 10,
          create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          CONSTRAINT fk_role
            FOREIGN KEY (role_id)
              REFERENCES role (id)
        )`,
    );

    await queryRunner.query(`CREATE UNIQUE INDEX account_name_idx ON account (name)`);

    await queryRunner.query(`CREATE UNIQUE INDEX account_email_idx ON account (email)`);

    await queryRunner.query(
      `CREATE TRIGGER on_update_account BEFORE UPDATE ON account
        FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_time()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER on_update_account ON account`);

    await queryRunner.query(`DROP INDEX account_email_idx`);

    await queryRunner.query(`DROP INDEX account_name_idx`);

    await queryRunner.query(`DROP TABLE account`);
  }
}
