import { randomUUID } from 'crypto';

function discardOptionsQuery({ filters }) {
  const newQueries: Array<{ id: string; key: string; sql: string; type: string }> = [];
  const newFilters = filters.map((f) => {
    if (!['select', 'multi-select'].includes(f.type)) {
      return f;
    }

    const { options_query = {}, ...restConfig } = f.config;
    const ret = {
      ...f,
      config: {
        ...restConfig,
        options_query_id: '',
      },
    };
    // skip if it's not using options_query
    if (!options_query.sql) {
      return ret;
    }

    const options_query_id = `filter-${randomUUID()}`;
    ret.config.options_query_id = options_query_id;

    newQueries.push({
      id: options_query_id,
      ...options_query,
    });
    return ret;
  });

  return { newQueries, newFilters };
}

/**
 * Changes: let filter.select & filter.multi_select use query
 * @param schema
 * @returns new schema
 */
export function main({ filters, definition, views, ...rest }: Record<string, any>) {
  const { queries = [], ...restDefinition } = definition;
  const { newQueries, newFilters } = discardOptionsQuery({ filters });
  return {
    filters: newFilters,
    views,
    definition: {
      ...restDefinition,
      queries: [...newQueries, ...queries],
    },
    ...rest,
    version: '5.9.0',
  };
}
