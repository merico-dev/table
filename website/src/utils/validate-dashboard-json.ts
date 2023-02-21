import Ajv from 'ajv';
import { DashboardJSONTypeDef } from './dashboard-json-type-def';

export function validateDashboardJSONContent(content: string) {
  try {
    const ajv = new Ajv();
    ajv.validate(DashboardJSONTypeDef, content);
  } catch (error) {
    console.log(error);
    throw new Error('Invalid content of json file, check out console for details');
  }
}
