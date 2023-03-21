import { MigrationInterface, QueryRunner } from 'typeorm';
import { ROLE_TYPES } from '../../api_models/role';

export class addDashboardPermissionsToExistingDashboards1678931621869 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const superadmin = (
      await queryRunner.query(`SELECT * FROM account WHERE role_id = ${ROLE_TYPES.SUPERADMIN} LIMIT 1`)
    )[0];
    const dashboards: any[] = await queryRunner.query('SELECT * FROM dashboard');
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
      for (let i = 0; i < permissions.length; i++) {
        await queryRunner.query(
          'INSERT INTO dashboard_permission (dashboard_id, owner_id, owner_type) values($1, $2, $3) ON CONFLICT (dashboard_id) DO NOTHING',
          permissions[i],
        );
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
