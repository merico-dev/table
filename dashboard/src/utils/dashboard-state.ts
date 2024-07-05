import { TDashboardState, TPayloadForSQL } from '~/model';

export function getEmptyDashboardState(): TDashboardState {
  return {
    filters: {},
    context: {},
  };
}

export function payloadToDashboardState(payload: TPayloadForSQL) {
  const empty = getEmptyDashboardState();
  if (!payload) {
    return getEmptyDashboardState();
  }
  const { filters = empty.filters, context = empty.context } = payload;
  return { filters, context };
}
