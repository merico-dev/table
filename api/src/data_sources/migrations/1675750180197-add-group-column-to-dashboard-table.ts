import { MigrationInterface, QueryRunner } from 'typeorm';

export class addGroupColumnToDashboardTable1675750180197 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE dashboard 
        ADD COLUMN "group" VARCHAR NOT NULL DEFAULT ''
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE dashboard 
        DROP COLUMN "group"
      `,
    );
  }
}
