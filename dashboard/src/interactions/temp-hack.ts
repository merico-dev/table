import { useEffect } from 'react';
import { DashboardModelInstance } from '..';
import _ from 'lodash';

export function useInteractionOperationHacks(model: DashboardModelInstance, inEditMode: boolean) {
  useEffect(() => {
    const handler = (e: $TSFixMe) => {
      console.log(e);
      const { viewID } = e.detail;
      if (!viewID) {
        console.error(new Error('[Open View] Needs to pick a view first'));
        return;
      }
      model.views.appendToVisibles(viewID);
      if (inEditMode) {
        model.views.setIDOfVIE(viewID);
      }
    };
    window.addEventListener('open-view', handler);
    return () => {
      window.removeEventListener('open-view', handler);
    };
  }, [model, inEditMode]);

  useEffect(() => {
    const handler = (e: $TSFixMe) => {
      console.log(e);
      const { dictionary, payload } = e.detail;
      if (!payload || Object.keys(payload).length === 0) {
        console.error(new Error('[Set Filter Values] payload is empty'));
        return;
      }
      Object.entries(dictionary).forEach(([filterKey, payloadKey]) => {
        // @ts-expect-error type of payload
        model.filters.setValueByKey(filterKey, _.get(payload, payloadKey));
      });
    };
    window.addEventListener('set-filter-values', handler);

    return () => {
      window.removeEventListener('set-filter-values', handler);
    };
  }, [model]);
}
