import { MigrationInterface, QueryRunner } from "typeorm"

export class createdata_sourceTable1657499149122 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE data_source
      (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        type VARCHAR NOT NULL,
        key VARCHAR NOT NULL,
        config jsonb NOT NULL DEFAULT '{}' ::jsonb,
        create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      )`
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX data_source_type_key_idx ON data_source (type, key)`
    );

    await queryRunner.query(
      `CREATE TRIGGER on_update_data_source BEFORE UPDATE ON data_source
      FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_time()`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER on_update_data_source ON data_source`
    );

    await queryRunner.query(
      `DROP INDEX data_source_type_key_idx`
    );

    await queryRunner.query(
      `DROP TABLE data_source`
    );
  }

}
