import { TDashboardStateValues, TPayloadForSQL } from '~/model';

export function getEmptyDashboardStateValues(): TDashboardStateValues {
  return {
    filters: {},
    context: {},
  };
}

export function payloadToDashboardStateValues(payload: TPayloadForSQL) {
  const empty = getEmptyDashboardStateValues();
  if (!payload) {
    return getEmptyDashboardStateValues();
  }
  const { filters = empty.filters, context = empty.context } = payload;
  return { filters, context };
}
