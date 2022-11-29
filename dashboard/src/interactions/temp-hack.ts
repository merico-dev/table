import { useEffect } from 'react';
import { AnyObject, DashboardModelInstance } from '..';
import _, { cloneDeepWith, template } from 'lodash';

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

  useEffect(() => {
    const handler = (e: $TSFixMe) => {
      console.log(e);
      const { urlTemplate, openInNewTab, enableEncoding = false, payload } = e.detail;
      if (!urlTemplate) {
        console.error(new Error('[Open Link] URL is empty'));
        return;
      }

      function urlEncodeFields(payload: AnyObject) {
        const result: AnyObject = cloneDeepWith(payload, (value) => {
          if (enableEncoding && typeof value === 'string') {
            return encodeURIComponent(value);
          }
        });
        return result;
      }

      const compiled = template(urlTemplate || '');
      const url = compiled(
        urlEncodeFields({
          ...payload,
          filters: model.filters.values,
          context: model.context.current,
        }),
      );

      window.open(url, openInNewTab ? '_blank' : '_self', 'noopener');
    };
    window.addEventListener('open-link', handler);

    return () => {
      window.removeEventListener('open-link', handler);
    };
  }, [model]);
}
