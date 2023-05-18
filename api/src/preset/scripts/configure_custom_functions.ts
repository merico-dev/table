import { dashboardDataSource } from '../../data_sources/dashboard';
import CustomFunction from '../../models/custom_function';
import path from 'path';
import fs from 'fs-extra';

async function upsert() {
  console.info('Starting upsert of preset custom functions');
  if (!dashboardDataSource.isInitialized) {
    await dashboardDataSource.initialize();
  }
  const queryRunner = dashboardDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const customFunctionRepo = queryRunner.manager.getRepository(CustomFunction);
    await customFunctionRepo.delete({ is_preset: true });

    let functions;
    if (fs.existsSync(path.resolve(__dirname, '../custom_functions/config.js'))) {
      functions = require(path.resolve(__dirname, '../custom_functions/config.js'));
    }
    if (!functions) throw new Error('custom functions config file not found');

    const functionNames = Object.keys(functions);
    for (let i = 0; i < functionNames.length; i++) {
      const functionName = functionNames[i];
      const customFunction = new CustomFunction();
      customFunction.id = functionName;
      customFunction.definition = functions[functionName].toString();
      customFunction.is_preset = true;
      await customFunctionRepo.save(customFunction);
    }
    await queryRunner.commitTransaction();
    console.info('Finished upsert of preset custom functions');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Error upserting preset custom functions:', error);
  } finally {
    await queryRunner.release();
    await dashboardDataSource.destroy();
  }
}

upsert();
