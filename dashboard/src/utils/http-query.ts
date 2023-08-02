import { AxiosRequestConfig } from 'axios';
import { IDataSource } from '~/api-caller/types';
import { ContextRecordType, FilterValuesType } from '~/model';
import { functionUtils } from './function-utils';

export function buildHTTPRequest(
  pre_process: string,
  params: { context: Record<string, any>; filters: Record<string, any> },
) {
  return new Function(`return ${pre_process}`)()(params, functionUtils) as AxiosRequestConfig;
}

export function explainHTTPRequest(pre_process: string, context: ContextRecordType, filters: FilterValuesType) {
  return buildHTTPRequest(pre_process, { context, filters });
}

export function preProcessWithDataSource(datasource: IDataSource, config: AxiosRequestConfig) {
  try {
    return new Function(`return ${datasource.config.processing.pre}`)()(config, functionUtils);
  } catch (error) {
    console.error(error);
    return config;
  }
}
export function postProcessWithDataSource(datasource: IDataSource, res: any) {
  return new Function(`return ${datasource.config.processing.post}`)()(res, functionUtils);
}
export function postProcessWithQuery(post_process: TFunctionString, res: any) {
  if (!post_process) {
    return res;
  }
  return new Function(`return ${post_process}`)()(res, functionUtils);
}
