import { injectable } from 'inversify';
import { PaginationRequest } from '../api_models/base';
import {
  CustomFunction as CustomFunctionAPIModel,
  CustomFunctionFilterObject,
  CustomFunctionPaginationResponse,
  CustomFunctionSortObject,
} from '../api_models/custom_function';
import { dashboardDataSource } from '../data_sources/dashboard';
import CustomFunction from '../models/custom_function';
import { ApiError, BAD_REQUEST } from '../utils/errors';
import { escapeLikePattern } from '../utils/helpers';
import { translate } from '../utils/i18n';

@injectable()
export class CustomFunctionService {
  async list(
    filter: CustomFunctionFilterObject | undefined,
    sort: CustomFunctionSortObject[],
    pagination: PaginationRequest,
  ): Promise<CustomFunctionPaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager
      .createQueryBuilder()
      .from(CustomFunction, 'custom_function')
      .where('true')
      .orderBy(sort[0].field, sort[0].order)
      .offset(offset)
      .limit(pagination.pagesize);

    if (filter?.id) {
      filter.id.isFuzzy
        ? qb.andWhere('custom_function.id ilike :id', { id: `%${escapeLikePattern(filter.id.value)}%` })
        : qb.andWhere('custom_function.id = :id', { id: filter.id.value });
    }

    sort.slice(1).forEach((s) => {
      qb.addOrderBy(s.field, s.order);
    });

    const datasources = await qb.getRawMany<CustomFunction>();
    const total = await qb.getCount();
    return {
      total,
      offset,
      data: datasources,
    };
  }

  async get(id: string): Promise<CustomFunctionAPIModel> {
    const customFunctionRepo = dashboardDataSource.getRepository(CustomFunction);
    return await customFunctionRepo.findOneByOrFail({ id });
  }

  async create(id: string, definition: string, locale: string): Promise<CustomFunctionAPIModel> {
    const customFunctionRepo = dashboardDataSource.getRepository(CustomFunction);
    if (await customFunctionRepo.exist({ where: { id } })) {
      throw new ApiError(BAD_REQUEST, { message: translate('CUSTOM_FUNCTION_ALREADY_EXISTS', locale) });
    }
    const customFunction = new CustomFunction();
    customFunction.id = id;
    customFunction.definition = definition;
    return await customFunctionRepo.save(customFunction);
  }

  async update(id: string, definition: string, locale: string): Promise<CustomFunctionAPIModel> {
    const customFunctionRepo = dashboardDataSource.getRepository(CustomFunction);
    const customFunction = await customFunctionRepo.findOneByOrFail({ id });
    if (customFunction.is_preset) {
      throw new ApiError(BAD_REQUEST, { message: translate('CUSTOM_FUNCTION_NO_EDIT_PRESET', locale) });
    }
    customFunction.definition = definition;
    return await customFunctionRepo.save(customFunction);
  }

  async delete(id: string, locale: string): Promise<void> {
    const customFunctionRepo = dashboardDataSource.getRepository(CustomFunction);
    const customFunction = await customFunctionRepo.findOneByOrFail({ id });
    if (customFunction.is_preset) {
      throw new ApiError(BAD_REQUEST, { message: translate('CUSTOM_FUNCTION_NO_DELETE_PRESET', locale) });
    }
    await customFunctionRepo.delete(customFunction.id);
  }
}
