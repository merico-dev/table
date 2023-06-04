import { MigrationInterface, QueryRunner } from 'typeorm';

export class createSqlSnippetsTable1685091416851 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE sql_snippet
      (
        id VARCHAR NOT NULL,
        content TEXT,
        is_preset bool NOT NULL DEFAULT false,
        create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      )`,
    );

    await queryRunner.query(
      `CREATE TRIGGER on_update_sql_snippet BEFORE UPDATE ON sql_snippet
      FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_time()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER on_update_sql_snippet ON sql_snippet`);

    await queryRunner.query(`DROP TABLE sql_snippet`);
  }
}
