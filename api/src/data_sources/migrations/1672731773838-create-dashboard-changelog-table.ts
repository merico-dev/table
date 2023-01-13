import { MigrationInterface, QueryRunner } from 'typeorm';

export class createDashboardChangelogTable1672731773838 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE dashboard_changelog
      (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        dashboard_id uuid NOT NULL,
        diff text,
        create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_dashboard
          FOREIGN KEY (dashboard_id)
            REFERENCES dashboard(id)
            ON DELETE CASCADE
      )`
    );

    await queryRunner.query(
      `CREATE TRIGGER on_update_dashboard_changelog BEFORE UPDATE ON dashboard_changelog
      FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_time()`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER on_update_dashboard_changelog ON dashboard_changelog`
    );

    await queryRunner.query(
      `DROP TABLE dashboard_changelog`
    );
  }

}
