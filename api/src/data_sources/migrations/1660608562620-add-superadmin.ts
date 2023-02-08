import { MigrationInterface, QueryRunner } from 'typeorm';
import bcrypt from 'bcrypt';
import { ROLE_TYPES } from '../../api_models/role';
import Account from '../../models/account';
import { SALT_ROUNDS } from '../../utils/constants';

const password = process.env.SUPER_ADMIN_PASSWORD ?? 'secret';

async function generateSuperadminAccount() {
  const superadmin_account = new Account();
  superadmin_account.name = 'superadmin';
  superadmin_account.password = await bcrypt.hash(password, SALT_ROUNDS);
  superadmin_account.role_id = ROLE_TYPES.SUPERADMIN;
  return superadmin_account;
}

export class addSuperadmin1660608562620 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const account = await generateSuperadminAccount();
    await queryRunner.manager.insert(Account, account);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DELETE FROM account WHERE name = 'superadmin'`);
  }
}
