import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrateDashboardContentToDashboardContent1680595965759 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO dashboard_content (dashboard_id, name, content)
        SELECT id, name, content
        FROM dashboard
    `);

    await queryRunner.query(`
      UPDATE dashboard
        SET content_id = dashboard_content.id
        FROM dashboard_content
        WHERE dashboard.id = dashboard_content.dashboard_id
    `);

    await queryRunner.query(`
      ALTER TABLE dashboard
        DROP COLUMN content
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE dashboard
        ADD COLUMN content jsonb NOT NULL DEFAULT '{}' ::jsonb
    `);

    await queryRunner.query(`
      UPDATE dashboard
        SET content = dashboard_content.content
        FROM dashboard_content
        WHERE dashboard.content_id IS NOT NULL
        AND dashboard.content_id = dashboard_content.id
    `);

    await queryRunner.query(`
      DELETE FROM dashboard_content
    `);
  }
}
