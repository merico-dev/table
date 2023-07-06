import { MigrationInterface, QueryRunner } from 'typeorm';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../../utils/constants';

const password = process.env.SUPER_ADMIN_PASSWORD ?? 'secret';

export class addSuperadmin1660608562620 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      INSERT INTO account (name, password, role_id) VALUES ($1, $2, $3)
    `,
      ['superadmin', await bcrypt.hash(password, SALT_ROUNDS), 50],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DELETE FROM account WHERE name = 'superadmin'`);
  }
}
