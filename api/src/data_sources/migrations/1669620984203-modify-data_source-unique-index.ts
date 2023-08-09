import { MigrationInterface, QueryRunner } from 'typeorm';
import DataSource from '../../models/datasource';

export class modifyDataSourceUniqueIndex1669620984203 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const duplicates: { type: string; key: string; num: string }[] = await queryRunner.manager
      .createQueryBuilder()
      .from(DataSource, 'data_source')
      .select('type')
      .addSelect('key')
      .addSelect('count(*)', 'num')
      .groupBy('type')
      .addGroupBy('key')
      .getRawMany();

    for (const info of duplicates) {
      if (parseInt(info.num) === 1) continue;
      await queryRunner.manager
        .createQueryBuilder()
        .from(DataSource, 'data_source')
        .where('type = :type', { type: info.type })
        .andWhere('key = :key', { key: info.key })
        .andWhere('is_preset = FALSE')
        .delete()
        .execute();
    }

    await queryRunner.query(`DROP INDEX data_source_type_key_preset_idx`);

    await queryRunner.query(`CREATE UNIQUE INDEX data_source_type_key_idx ON data_source (type, key)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX data_source_type_key_idx`);

    await queryRunner.query(
      `CREATE UNIQUE INDEX data_source_type_key_preset_idx ON data_source (type, key, is_preset)`,
    );
  }
}
