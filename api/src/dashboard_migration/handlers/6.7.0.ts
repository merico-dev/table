/**
 * Changes: add name to query, init name with id
 * @param schema
 * @returns new schema
 */
export function main({ definition, ...rest }: Record<string, any>) {
  return {
    definition: {
      ...definition,
      queries: definition.queries.map((q) => ({
        ...q,
        name: q.id,
      })),
    },
    ...rest,
    version: '6.7.0',
  };
}
