import { MigrationInterface, QueryRunner } from 'typeorm';

export class createConfigTable1675139698071 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE config
      (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        resource_type VARCHAR NOT NULL,
        resource_id VARCHAR,
        key VARCHAR NOT NULL,
        value TEXT,
        create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      )`,
    );

    await queryRunner.query(
      `CREATE TRIGGER on_update_config BEFORE UPDATE ON config
      FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_time()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER on_update_config ON config`);

    await queryRunner.query(`DROP TABLE config`);
  }
}
