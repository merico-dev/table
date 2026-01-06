import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1653356327062 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.gen_random_uuid()
        RETURNS uuid
        LANGUAGE sql
        PARALLEL SAFE
      AS $$
        SELECT cast(
          lpad(to_hex(floor(random() * 4294967296)::bigint), 8, '0') || '-' ||
          lpad(to_hex(floor(random() * 65536)::int), 4, '0') || '-' ||
          '4' || lpad(to_hex(floor(random() * 4096)::int), 3, '0') || '-' ||
          substr('89ab', (floor(random() * 4) + 1)::int, 1) ||
          lpad(to_hex(floor(random() * 4096)::int), 3, '0') || '-' ||
          lpad(to_hex(floor(random() * 281474976710656)::bigint), 12, '0')
        AS uuid);
      $$;
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION trigger_set_update_time() RETURNS TRIGGER AS $$
      BEGIN
        NEW.update_time = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP FUNCTION IF EXISTS trigger_set_update_time()`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS public.gen_random_uuid()`);
  }
}
