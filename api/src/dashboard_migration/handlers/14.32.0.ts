function upgradeQueries(queries: Record<string, any>[]) {
  return queries.map((q) => {
    const { type, react_to, ...rest } = q;
    if (type !== 'transform') {
      return q;
    }
    return {
      type,
      ...rest,
      react_to: react_to ?? [],
    };
  });
}

/**
 * https://github.com/merico-dev/table/issues/1678
 */
export function main({ definition, ...rest }: Record<string, any>) {
  const finalQueries = upgradeQueries(definition.queries);
  return {
    ...rest,
    definition: {
      ...definition,
      queries: finalQueries,
    },
    version: '14.32.0',
  };
}
