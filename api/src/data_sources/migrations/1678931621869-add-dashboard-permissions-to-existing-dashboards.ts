import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDashboardPermissionsToExistingDashboards1678931621869 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const superadmin = (await queryRunner.query(`SELECT * FROM account WHERE role_id = 50 LIMIT 1`))[0];
    const dashboards: { id: string; is_preset: boolean }[] = await queryRunner.query('SELECT * FROM dashboard');
    const permissions: [string, string | null, string | null][] = [];
    dashboards.forEach((dashboard) => {
      const permission: [string, string | null, string | null] = [
        dashboard.id,
        dashboard.is_preset ? superadmin.id : null,
        dashboard.is_preset ? 'ACCOUNT' : null,
      ];
      permissions.push(permission);
    });
    if (permissions.length) {
      for (const permission of permissions) {
        await queryRunner.query(
          'INSERT INTO dashboard_permission (id, owner_id, owner_type) values($1, $2, $3) ON CONFLICT (id) DO NOTHING',
          permission,
        );
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {
    // NOTHING TO DO
  }
}
