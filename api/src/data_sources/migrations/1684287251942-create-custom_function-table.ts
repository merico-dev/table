import { MigrationInterface, QueryRunner } from 'typeorm';

export class createCustomFunctionTable1684287251942 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE custom_function
      (
        id VARCHAR NOT NULL,
        definition TEXT,
        is_preset bool NOT NULL DEFAULT false,
        create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      )`,
    );

    await queryRunner.query(
      `CREATE TRIGGER on_update_custom_function BEFORE UPDATE ON custom_function
      FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_time()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER on_update_custom_function ON custom_function`);

    await queryRunner.query(`DROP TABLE custom_function`);
  }
}
