import { dashboardDataSource } from '../../data_sources/dashboard';
import SqlSnippet from '../../models/sql_snippet';
import path from 'path';
import fs from 'fs-extra';

async function upsert() {
  console.info('Starting upsert of preset sql snippets');
  if (!dashboardDataSource.isInitialized) {
    await dashboardDataSource.initialize();
  }
  const queryRunner = dashboardDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const sqlSnippetRepo = queryRunner.manager.getRepository(SqlSnippet);
    await sqlSnippetRepo.delete({ is_preset: true });

    let sqlSnippets;
    if (fs.existsSync(path.resolve(__dirname, '../sql_snippets/config.json'))) {
      sqlSnippets = require(path.resolve(__dirname, '../sql_snippets/config.json'));
    }
    if (!sqlSnippets) throw new Error('sql snippets config file not found');

    const sqlSnippetNames = Object.keys(sqlSnippets);
    for (let i = 0; i < sqlSnippetNames.length; i++) {
      const sqlSnippetName = sqlSnippetNames[i];
      const sqlSnippet = new SqlSnippet();
      sqlSnippet.id = sqlSnippetName;
      sqlSnippet.content = sqlSnippets[sqlSnippetName];
      sqlSnippet.is_preset = true;
      await sqlSnippetRepo.save(sqlSnippet);
    }
    await queryRunner.commitTransaction();
    console.info('Finished upsert of preset sql snippets');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Error upserting preset sql snippets:', error);
  } finally {
    await queryRunner.release();
    await dashboardDataSource.destroy();
  }
}

upsert();
