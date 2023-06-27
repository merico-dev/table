import { injectable } from 'inversify';
import { PaginationRequest } from '../api_models/base';
import {
  SqlSnippet as SqlSnippetAPIModel,
  SqlSnippetFilterObject,
  SqlSnippetPaginationResponse,
  SqlSnippetSortObject,
} from '../api_models/sql_snippet';
import { dashboardDataSource } from '../data_sources/dashboard';
import SqlSnippet from '../models/sql_snippet';
import { ApiError, BAD_REQUEST } from '../utils/errors';
import { escapeLikePattern } from '../utils/helpers';
import { translate } from '../utils/i18n';

@injectable()
export class SqlSnippetService {
  async list(
    filter: SqlSnippetFilterObject | undefined,
    sort: SqlSnippetSortObject[],
    pagination: PaginationRequest,
  ): Promise<SqlSnippetPaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager
      .createQueryBuilder()
      .from(SqlSnippet, 'sql_snippet')
      .where('true')
      .orderBy(sort[0].field, sort[0].order)
      .offset(offset)
      .limit(pagination.pagesize);

    if (filter?.id) {
      filter.id.isFuzzy
        ? qb.andWhere('sql_snippet.id ilike :id', { id: `%${escapeLikePattern(filter.id.value)}%` })
        : qb.andWhere('sql_snippet.id = :id', { id: filter.id.value });
    }

    sort.slice(1).forEach((s) => {
      qb.addOrderBy(s.field, s.order);
    });

    const datasources = await qb.getRawMany<SqlSnippet>();
    const total = await qb.getCount();
    return {
      total,
      offset,
      data: datasources,
    };
  }

  async get(id: string): Promise<SqlSnippetAPIModel> {
    const sqlSnippetRepo = dashboardDataSource.getRepository(SqlSnippet);
    return await sqlSnippetRepo.findOneByOrFail({ id });
  }

  async create(id: string, content: string, locale: string): Promise<SqlSnippetAPIModel> {
    const sqlSnippetRepo = dashboardDataSource.getRepository(SqlSnippet);
    if (await sqlSnippetRepo.exist({ where: { id } })) {
      throw new ApiError(BAD_REQUEST, { message: translate('SQL_SNIPPET_ALREADY_EXISTS', locale) });
    }
    const sqlSnippet = new SqlSnippet();
    sqlSnippet.id = id;
    sqlSnippet.content = content;
    return await sqlSnippetRepo.save(sqlSnippet);
  }

  async update(id: string, content: string, locale: string): Promise<SqlSnippetAPIModel> {
    const sqlSnippetRepo = dashboardDataSource.getRepository(SqlSnippet);
    const sqlSnippet = await sqlSnippetRepo.findOneByOrFail({ id });
    if (sqlSnippet.is_preset) {
      throw new ApiError(BAD_REQUEST, { message: translate('SQL_SNIPPET_NO_EDIT_PRESET', locale) });
    }
    sqlSnippet.content = content;
    return await sqlSnippetRepo.save(sqlSnippet);
  }

  async delete(id: string, locale: string): Promise<void> {
    const sqlSnippetRepo = dashboardDataSource.getRepository(SqlSnippet);
    const sqlSnippet = await sqlSnippetRepo.findOneByOrFail({ id });
    if (sqlSnippet.is_preset) {
      throw new ApiError(BAD_REQUEST, { message: translate('SQL_SNIPPET_NO_DELETE_PRESET', locale) });
    }
    await sqlSnippetRepo.delete(sqlSnippet.id);
  }
}
