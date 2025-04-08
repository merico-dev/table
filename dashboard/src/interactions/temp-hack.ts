import _, { cloneDeepWith, template } from 'lodash';
import { useEffect } from 'react';
import { ContentRenderModelInstance } from '~/dashboard-render/model';
import { AnyObject, ContentModelInstance } from '..';
import { useNavigate } from 'react-router-dom';

function logEvent(e: any) {
  console.groupCollapsed('Running operation ', e.type);
  console.log(e);
  console.groupEnd();
}

export function useInteractionOperationHacks(
  model: ContentModelInstance | ContentRenderModelInstance,
  inEditMode: boolean,
) {
  useEffect(() => {
    const handler = (e: $TSFixMe) => {
      logEvent(e);

      const { viewID } = e.detail;
      if (!viewID) {
        console.error(new Error('[Open View] Needs to pick a view first'));
        return;
      }
      model.views.appendToVisibles(viewID);
      if (inEditMode) {
        (model as ContentModelInstance).views.setIDOfVIE(viewID);
      }
    };
    window.addEventListener('open-view', handler);
    return () => {
      window.removeEventListener('open-view', handler);
    };
  }, [model, inEditMode]);

  const navigate = useNavigate();
  useEffect(() => {
    const handler = (e: $TSFixMe) => {
      logEvent(e);

      const { panelID } = e.detail;
      if (!panelID) {
        console.error(new Error('[Scroll to Panel] Needs to pick a panel first'));
        return;
      }
      navigate(`#${panelID}`);
      const element = document.getElementById(panelID);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('scroll_to_panel', handler);
    return () => {
      window.removeEventListener('scroll_to_panel', handler);
    };
  }, [navigate]);

  useEffect(() => {
    const handler = (e: $TSFixMe) => {
      logEvent(e);
      const { dictionary, payload } = e.detail;
      if (!payload || Object.keys(payload).length === 0) {
        console.error(new Error('[Set Filter Values] payload is empty'));
        return;
      }
      const patch: Record<string, any> = {};
      Object.entries(dictionary).forEach(([filterKey, payloadKey]) => {
        // @ts-expect-error type of payload
        const newValue = _.get(payload, payloadKey);
        patch[filterKey] = newValue;
      });
      model.filters.applyValuesPatch(patch);
    };
    window.addEventListener('set-filter-values', handler);

    return () => {
      window.removeEventListener('set-filter-values', handler);
    };
  }, [model]);

  useEffect(() => {
    function getEmptyValueByType(v: string | number | boolean | Array<any> | AnyObject) {
      if (Array.isArray(v)) {
        return [];
      }
      if (typeof v === 'object') {
        return {};
      }
      if (typeof v === 'boolean') {
        return false;
      }
      if (typeof v === 'string') {
        return '';
      }
      if (typeof v === 'number') {
        return 0;
      }
      return v;
    }
    const handler = (e: $TSFixMe) => {
      logEvent(e);
      const patch: Record<string, any> = {};
      const { filter_keys } = e.detail as { filter_keys: string[] };
      filter_keys.forEach((k) => {
        const currentValue = _.get(model.filters.values, k);
        const newValue = getEmptyValueByType(currentValue);
        patch[k] = newValue;
      });
      model.filters.applyValuesPatch(patch);
    };
    window.addEventListener('clear-filter-values', handler);

    return () => {
      window.removeEventListener('clear-filter-values', handler);
    };
  }, [model]);

  useEffect(() => {
    const handler = (e: $TSFixMe) => {
      logEvent(e);
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
          filters: model.payloadForSQL.filters,
          context: model.payloadForSQL.context,
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
