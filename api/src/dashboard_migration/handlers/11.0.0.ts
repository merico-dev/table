function upgradeQueries(queries: Record<string, any>[]) {
  return queries.map((p) => {
    const { dep_query_ids, ...rest } = p;
    return {
      ...rest,
      dep_query_ids: dep_query_ids ?? [],
    };
  });
}

/**
 * https://github.com/merico-dev/table/issues/1308
 */
export function main({ definition, ...rest }: Record<string, any>) {
  const finalQueries = upgradeQueries(definition.queries);
  return {
    ...rest,
    definition: {
      ...definition,
      queries: finalQueries,
    },
    version: '11.0.0',
  };
}
