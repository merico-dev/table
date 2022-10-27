import React from 'react';
import { ViewModelInstance } from '..';

export function usePanelFullScreen(view: ViewModelInstance, panelID: string, setPanelID: (v: string) => void) {
  const acceptsCallback = view.id === 'Main';
  const [fullScreenPanelID, setFullScreenPanelID] = React.useState<string | null>(() => {
    if (acceptsCallback && view.panels.findByID(panelID)) {
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

  const fullScreenPanel = fullScreenPanelID ? view.panels.findByID(fullScreenPanelID) : null;

  const inFullScreen = !!fullScreenPanel;
  return {
    viewPanelInFullScreen,
    exitFullScreen,
    inFullScreen,
    fullScreenPanel,
  };
}
