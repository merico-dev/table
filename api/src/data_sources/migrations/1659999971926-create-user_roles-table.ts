import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserRolesTable1659999971926 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE role
        (
          id SMALLINT NOT NULL,
          name VARCHAR NOT NULL,
          description TEXT,
          PRIMARY KEY (id)
        )`,
    );

    await queryRunner.query(
      `INSERT INTO role VALUES 
        (10, 'INACTIVE', 'Disabled user. Can not login'),
        (20, 'READER', 'Can view dashboards'),
        (30, 'AUTHOR', 'Can view and create dashboards'),
        (40, 'ADMIN', 'Can view and create dashboards. Can add and delete datasources. Can add users except other admins'),
        (50, 'SUPERADMIN', 'Can do everything')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE role`);
  }
}
