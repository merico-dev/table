import { MigrationInterface, QueryRunner } from 'typeorm'

export class addExtensionCitext1660005273691 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `CREATE EXTENSION IF NOT EXISTS citext`
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `DROP EXTENSION IF EXISTS citext`
      );
    }

}
