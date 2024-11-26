type LegacyQuery = {
  id: string;
  name: string;
  key: string;
  pre_process: string;
  post_process: string;
  run_by: string[];
  react_to: string[];
  dep_query_ids: string[];
  type: 'postgresql' | 'mysql' | 'http' | 'transform' | 'merico_metric_system';
  sql: string;
};
type BaseQuery = {
  id: string;
  name: string;
  key: string;
  pre_process: string;
  post_process: string;
  run_by: string[];
};
type DBQuery = BaseQuery & {
  type: 'postgresql' | 'mysql';
  config: {
    _type: 'postgresql' | 'mysql';
    sql: string;
  };
};
type HTTPQuery = BaseQuery & {
  type: 'http';
  config: {
    _type: 'http';
    react_to: string[];
  };
};
type TransformQuery = BaseQuery & {
  type: 'transform';
  config: {
    _type: 'transform';
    dep_query_ids: string[];
  };
};
type MericoMetricQuery = BaseQuery & {
  type: 'merico_metric_system';
  config: {
    _type: 'merico_metric_system';
    id: string;
    type: string;
    filters: Record<string, string>;
    groupBys: string[];
    timeQuery: {
      range_variable: string;
      unit_variable: string;
      timezone: string;
      stepKeyFormat: string;
    };
  };
};
type NewQuery = DBQuery | HTTPQuery | TransformQuery | MericoMetricQuery;

function getCommonProperties(q: LegacyQuery) {
  const { id, name, key, pre_process, post_process, run_by } = q;
  return { id, name, key, pre_process, post_process, run_by };
}

function toDBQuery(q: LegacyQuery): DBQuery {
  const { sql, type } = q;
  if (type !== 'postgresql' && type !== 'mysql') {
    throw new Error(`wrong type[${type}]`);
  }

  return {
    ...getCommonProperties(q),
    type,
    config: { _type: type, sql },
  };
}

function toHTTPQuery(q: LegacyQuery): HTTPQuery {
  const { react_to, type } = q;
  if (type !== 'http') {
    throw new Error(`wrong type[${type}]`);
  }

  return {
    ...getCommonProperties(q),
    type,
    config: { react_to, _type: type },
  };
}

function toTransformQuery(q: LegacyQuery): TransformQuery {
  const { dep_query_ids, type } = q;
  if (type !== 'transform') {
    throw new Error(`wrong type[${type}]`);
  }

  return {
    ...getCommonProperties(q),
    type,
    config: { _type: type, dep_query_ids },
  };
}

function toMMQuery(q: LegacyQuery): MericoMetricQuery {
  const { type } = q;
  if (type !== 'merico_metric_system') {
    throw new Error(`wrong type[${type}]`);
  }

  return {
    ...getCommonProperties(q),
    type,
    config: {
      _type: type,
      id: '',
      type: 'derived',
      filters: {},
      groupBys: [],
      timeQuery: {
        range_variable: '',
        unit_variable: '',
        timezone: 'PRC',
        stepKeyFormat: 'YYYY-MM-DD',
      },
    },
  };
}

function upgradeQueries(queries: LegacyQuery[]): NewQuery[] {
  return queries.map((q) => {
    if ('config' in q) {
      console.warn("query is already upgraded, but it's unexpected");
      console.log(JSON.stringify(q, null, 2));
      return q as NewQuery;
    }
    switch (q.type) {
      case 'postgresql':
      case 'mysql':
        return toDBQuery(q);
      case 'http':
        return toHTTPQuery(q);
      case 'transform':
        return toTransformQuery(q);
      case 'merico_metric_system':
        return toMMQuery(q);
      default:
        throw new Error(`wrong type[${q.type}]`);
    }
  });
}

/**
 * https://github.com/merico-dev/table/issues/1579
 */
export function main({ definition, ...rest }: Record<string, any>) {
  const finalQueries = upgradeQueries(definition.queries);
  return {
    ...rest,
    definition: {
      ...definition,
      queries: finalQueries,
    },
    version: '13.45.0',
  };
}
