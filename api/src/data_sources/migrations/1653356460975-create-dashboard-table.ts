import { MigrationInterface, QueryRunner } from 'typeorm';

export class createDashboardTable1653356460975 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE dashboard 
      (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        name VARCHAR NOT NULL,
        content jsonb NOT NULL DEFAULT '{}' ::jsonb,
        create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        is_removed bool NOT NULL DEFAULT false,
        PRIMARY KEY (id)
      )`
    );

    await queryRunner.query(
      `CREATE TRIGGER on_update_dashboard BEFORE UPDATE ON dashboard
      FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_time()`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER on_update_dashboard ON dashboard`
    );

    await queryRunner.query(
      `DROP TABLE dashboard`
    );
  }

}
