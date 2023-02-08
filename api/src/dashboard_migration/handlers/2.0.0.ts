/**
 * from before-versioning state to 2.0.0
 * @param schema
 * @returns schema with version set to 2.0.0
 */
export function main(schema: Record<string, any>) {
  return {
    ...schema,
    version: '2.0.0',
  };
}
