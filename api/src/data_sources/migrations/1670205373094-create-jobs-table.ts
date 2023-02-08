import { MigrationInterface, QueryRunner } from 'typeorm';

export class createJobsTable1670205373094 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE job
      (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        type VARCHAR NOT NULL,
        status VARCHAR NOT NULL,
        params jsonb NOT NULL DEFAULT '{}' ::jsonb,
        result jsonb NOT NULL DEFAULT '{}' ::jsonb,
        create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      )`,
    );

    await queryRunner.query(
      `CREATE TRIGGER on_update_job BEFORE UPDATE ON job
      FOR EACH ROW EXECUTE PROCEDURE trigger_set_update_time()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER on_update_job ON job`);

    await queryRunner.query(`DROP TABLE job`);
  }
}
