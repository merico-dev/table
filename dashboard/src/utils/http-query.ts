import dayjs from 'dayjs';
import lodash from 'lodash';
import numbro from 'numbro';
import { ContextInfoType, FilterValuesType } from '..';

const utils = {
  lodash,
  numbro,
  dayjs,
};

export function buildHTTPRequest(
  pre_process: string,
  params: { context: Record<string, any>; filters: Record<string, any> },
) {
  return new Function(`return ${pre_process}`)()(params, utils);
}

export function getHTTPReqeustBuilderParams(
  real_context: ContextInfoType,
  mock_context: Record<string, $TSFixMe>,
  filterValues: FilterValuesType,
) {
  const context = {
    ...mock_context,
    ...real_context,
  };
  return {
    context,
    filters: filterValues,
  };
}

export function explainHTTPRequest(
  pre_process: string,
  context: ContextInfoType,
  mock_context: Record<string, $TSFixMe>,
  filterValues: FilterValuesType,
) {
  try {
    const params = getHTTPReqeustBuilderParams(context, mock_context, filterValues);
    return buildHTTPRequest(pre_process, params);
  } catch (error: $TSFixMe) {
    console.error(error);
    return error.message;
  }
}
