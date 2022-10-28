import { useEffect } from 'react';
import { DashboardModelInstance } from '..';
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
}
