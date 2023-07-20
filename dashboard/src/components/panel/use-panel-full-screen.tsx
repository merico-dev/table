import React from 'react';
import { useContentModelContext, ViewModelInstance } from '../..';

export function usePanelFullScreen(view: ViewModelInstance, panelID: string, setPanelID: (v: string) => void) {
  const { panels } = useContentModelContext();
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
