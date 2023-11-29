import { AnyObject, CURRENT_SCHEMA_VERSION } from '@devtable/dashboard';
import Ajv from 'ajv';
import { DashboardJSONTypeDef } from './dashboard-json-type-def';
import { compare } from 'compare-versions';

export function validateDashboardJSONFile(e: ProgressEvent<FileReader>) {
  if (e.target === null) {
    throw new Error('FileReader failed with null result');
  }

  if (typeof e.target.result !== 'string') {
    throw new Error(`Unparsable file content of type: ${typeof e.target.result}`);
  }

  let content = JSON.parse(e.target.result);
  if ('content' in content) {
    content = content.content;
  }

  validateDashboardJSONContent(content);

  if (compare(content.version, CURRENT_SCHEMA_VERSION, '>')) {
    throw new Error('Unsupported schema version (ahead of current version)');
  }

  return content;
}

function validateDashboardJSONContent(content: AnyObject) {
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
