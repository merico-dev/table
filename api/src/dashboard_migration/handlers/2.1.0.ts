/**
 * from before-versioning state to 2.0.0
 * @param schema
 * @returns schema with version set to 2.0.0
 */
 export function main(schema: Record<string, any>) {
  return {
    filters: [],
    ...schema,
    version: '2.1.0',
  }
}