import Ajv from 'ajv';
import { DashboardJSONTypeDef } from './dashboard-json-type-def';

export function validateDashboardJSONContent(content: string) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(DashboardJSONTypeDef, content);
    if (!valid) {
      throw new Error(ajv.errorsText(ajv.errors));
    }
  } catch (error) {
    console.log(error);
    throw new Error('Invalid content of json file, check out console for details');
  }
}
