function upgradeQueries(queries: Record<string, any>[]) {
  return queries.map((q) => {
    const { react_to = [], ...rest } = q;
    return {
      ...rest,
      react_to,
    };
  });
}

/**
 * https://github.com/merico-dev/table/issues/980
 * @param schema
 * @returns new schema
 */
export function main({ definition, ...rest }: Record<string, any>) {
  const finalQueries = upgradeQueries(definition.queries);
  return {
    ...rest,
    definition: {
      ...definition,
      queries: finalQueries,
    },
    version: '9.11.0',
  };
}
