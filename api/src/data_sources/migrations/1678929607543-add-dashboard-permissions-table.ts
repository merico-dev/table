import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDashboardPermissionsTable1678929607543 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE dashboard_permission
      (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        dashboard_id uuid NOT NULL DEFAULT gen_random_uuid(),
        owner_id uuid,
        owner_type VARCHAR,
        can_view jsonb NOT NULL DEFAULT '[]' ::jsonb,
        can_edit jsonb NOT NULL DEFAULT '[]' ::jsonb,
        create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_dashboard
          FOREIGN KEY (dashboard_id)
            REFERENCES dashboard(id)
            ON DELETE CASCADE
      )`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX dashboard_permission_dashboard_id_idx ON dashboard_permission (dashboard_id)`,
    );

    await queryRunner.query(
      `CREATE TRIGGER on_update_dashboard_permission BEFORE UPDATE ON dashboard_permission
      FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_time()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX dashboard_permission_dashboard_id_idx`);

    await queryRunner.query(`DROP TRIGGER on_update_dashboard_permission ON dashboard_permission`);

    await queryRunner.query(`DROP TABLE dashboard_permission`);
  }
}
