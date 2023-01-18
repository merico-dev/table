import { jsonSchemaDiff } from './json-schema-diff';

describe('jsonSchemaDiff', () => {
  it('should work', () => {
    expect(jsonSchemaDiff()).toEqual('json-schema-diff');
  });
});
