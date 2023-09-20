import { TDashboardState, TPayloadForSQL } from '~/model';

function getEmptyState(): TDashboardState {
  return {
    filters: {},
    context: {},
  };
}

export function payloadToDashboardState(payload: TPayloadForSQL) {
  const empty = getEmptyState();
  if (!payload) {
    return getEmptyState();
  }
  const { filters = empty.filters, context = empty.context } = payload;
  return { filters, context };
}
