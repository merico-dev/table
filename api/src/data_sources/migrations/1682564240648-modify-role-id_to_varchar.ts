import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifyRoleIdToVarchar1682564240648 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE account DROP CONSTRAINT fk_role');
    await queryRunner.query('ALTER TABLE account ALTER COLUMN role_id SET DATA TYPE VARCHAR');

    await queryRunner.query('ALTER TABLE api_key DROP CONSTRAINT fk_role');
    await queryRunner.query('ALTER TABLE api_key ALTER COLUMN role_id SET DATA TYPE VARCHAR');

    await queryRunner.query('ALTER TABLE role ALTER COLUMN id SET DATA TYPE VARCHAR');
    await queryRunner.query(`ALTER TABLE role ADD COLUMN permissions jsonb NOT NULL DEFAULT '[]' ::jsonb`);

    await queryRunner.query('UPDATE account SET role_id = (SELECT name FROM role WHERE id = account.role_id)');
    await queryRunner.query('UPDATE api_key SET role_id = (SELECT name FROM role WHERE id = api_key.role_id)');

    await queryRunner.query('UPDATE role SET id = name');
    await queryRunner.query('ALTER TABLE role DROP COLUMN name');

    await queryRunner.query('ALTER TABLE account ADD CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id)');
    await queryRunner.query('ALTER TABLE api_key ADD CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE account DROP CONSTRAINT fk_role');
    await queryRunner.query('ALTER TABLE api_key DROP CONSTRAINT fk_role');

    await queryRunner.query('ALTER TABLE role DROP COLUMN permissions');
    await queryRunner.query(`ALTER TABLE role ADD COLUMN name VARCHAR NOT NULL DEFAULT ''`);

    await queryRunner.query(`DELETE FROM role WHERE id NOT IN ('INACTIVE','READER','AUTHOR','ADMIN','SUPERADMIN')`);
    await queryRunner.query('UPDATE role SET name = id');
    await queryRunner.query(`UPDATE role SET id = '10' WHERE name = 'INACTIVE'`);
    await queryRunner.query(`UPDATE role SET id = '20' WHERE name = 'READER'`);
    await queryRunner.query(`UPDATE role SET id = '30' WHERE name = 'AUTHOR'`);
    await queryRunner.query(`UPDATE role SET id = '40' WHERE name = 'ADMIN'`);
    await queryRunner.query(`UPDATE role SET id = '50' WHERE name = 'SUPERADMIN'`);

    await queryRunner.query('ALTER TABLE role ALTER COLUMN id SET DATA TYPE SMALLINT USING id::SMALLINT');

    await queryRunner.query(
      `UPDATE account set role_id = 'INACTIVE' WHERE role_id NOT IN ('INACTIVE','READER','AUTHOR','ADMIN','SUPERADMIN')`,
    );
    await queryRunner.query(
      `UPDATE api_key set role_id = 'INACTIVE' WHERE role_id NOT IN ('INACTIVE','READER','AUTHOR','ADMIN','SUPERADMIN')`,
    );
    await queryRunner.query('UPDATE account set role_id = (SELECT id FROM role WHERE name = account.role_id)');
    await queryRunner.query('UPDATE api_key set role_id = (SELECT id FROM role WHERE name = api_key.role_id)');

    await queryRunner.query('ALTER TABLE account ALTER COLUMN role_id SET DATA TYPE SMALLINT USING role_id::SMALLINT');
    await queryRunner.query('ALTER TABLE api_key ALTER COLUMN role_id SET DATA TYPE SMALLINT USING role_id::SMALLINT');

    await queryRunner.query('ALTER TABLE account ADD CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id)');
    await queryRunner.query('ALTER TABLE api_key ADD CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id)');
  }
}
