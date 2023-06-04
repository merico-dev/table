import { MigrationInterface, QueryRunner } from 'typeorm';

export class createDashboardContentTable1680511303370 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE dashboard_content (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        dashboard_id uuid NOT NULL,
        name VARCHAR NOT NULL,
        content jsonb NOT NULL DEFAULT '{}' ::jsonb,
        create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_dashboard
              FOREIGN KEY (dashboard_id)
                REFERENCES dashboard(id)
                ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX dashboard_content_dashboard_id_name ON dashboard_content (dashboard_id, name)`,
    );

    await queryRunner.query(
      `CREATE TRIGGER on_update_dashboard_content BEFORE UPDATE ON dashboard_content
      FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_time()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER on_update_dashboard_content ON dashboard_content`);

    await queryRunner.query(`DROP INDEX dashboard_content_dashboard_id_name`);

    await queryRunner.query(`DROP TABLE dashboard_content`);
  }
}
