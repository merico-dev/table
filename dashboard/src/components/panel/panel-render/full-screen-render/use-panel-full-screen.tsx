import React from 'react';
import { ViewMetaInstance } from '~/model';
import { useRenderContentModelContext } from '~/contexts';

export function usePanelFullScreen(view: ViewMetaInstance, panelID: string, setPanelID: (v: string) => void) {
  const { panels } = useRenderContentModelContext();
  const acceptsCallback = view.id === 'Main';
  const [fullScreenPanelID, setFullScreenPanelID] = React.useState<string | null>(() => {
    if (acceptsCallback && panels.findByID(panelID)) {
      return panelID;
    }
    return null;
  });

  const viewPanelInFullScreen = React.useCallback(
    (id: string) => {
      setFullScreenPanelID(id);
      if (acceptsCallback) {
        setPanelID(id);
      }
    },
    [acceptsCallback, setPanelID],
  );

  const exitFullScreen = React.useCallback(() => {
    setFullScreenPanelID(null);
    if (acceptsCallback) {
      setPanelID('');
    }
  }, [acceptsCallback, setPanelID]);

  const fullScreenPanel = fullScreenPanelID ? panels.findByID(fullScreenPanelID) : null;

  const inFullScreen = !!fullScreenPanel;
  return {
    viewPanelInFullScreen,
    exitFullScreen,
    inFullScreen,
    fullScreenPanel,
  };
}
