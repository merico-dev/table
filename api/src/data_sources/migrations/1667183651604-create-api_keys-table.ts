import { MigrationInterface, QueryRunner } from 'typeorm';

export class createApiKeysTable1667183651604 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `CREATE TABLE api_key
        (
          id uuid NOT NULL DEFAULT gen_random_uuid(),
          name citext NOT NULL,
          key VARCHAR NOT NULL,
          domain VARCHAR NOT NULL,
          role_id SMALLINT NOT NULL DEFAULT 10,
          create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          CONSTRAINT fk_role
            FOREIGN KEY (role_id)
              REFERENCES role (id)
        )
        `
      );

      await queryRunner.query(
        `CREATE UNIQUE INDEX api_key_name_idx ON api_key (name)`
      );

      await queryRunner.query(
        `CREATE TRIGGER on_update_api_key BEFORE UPDATE ON api_key
        FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_time()`
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `DROP TRIGGER on_update_api_key ON api_key`
      );

      await queryRunner.query(
        `DROP INDEX api_key_name_idx`
      );

      await queryRunner.query(
        `DROP TABLE api_key`
      );
    }

}
