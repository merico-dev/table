import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDashboardContentIdField1680595338529 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE dashboard
        ADD COLUMN content_id uuid
    `);

    await queryRunner.query(`
      ALTER TABLE dashboard
        ADD CONSTRAINT fk_dashboard_content FOREIGN KEY (content_id) REFERENCES dashboard_content(id) ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE dashboard
        DROP CONSTRAINT fk_dashboard_content
    `);

    await queryRunner.query(`
      ALTER TABLE dashboard
        DROP COLUMN content_id
    `);
  }
}
