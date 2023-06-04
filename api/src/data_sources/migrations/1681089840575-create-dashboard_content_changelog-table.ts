import { MigrationInterface, QueryRunner } from 'typeorm';

export class createDashboardContentChangelogTable1681089840575 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE dashboard_content_changelog
      (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        dashboard_content_id uuid NOT NULL,
        diff text,
        create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_dashboard_content
          FOREIGN KEY (dashboard_content_id)
            REFERENCES dashboard_content(id)
            ON DELETE CASCADE
      )`,
    );

    await queryRunner.query(
      `CREATE TRIGGER on_update_dashboard_content_changelog BEFORE UPDATE ON dashboard_content_changelog
      FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_time()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER on_update_dashboard_content_changelog ON dashboard_content_changelog`);

    await queryRunner.query(`DROP TABLE dashboard_content_changelog`);
  }
}
