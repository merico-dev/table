import React from 'react';
import { ViewModelInstance } from '..';

export function usePanelFullScreen(view: ViewModelInstance) {
  const [fullScreenPanelID, setFullScreenPanelID] = React.useState<string | null>(null);
  const viewPanelInFullScreen = React.useCallback((id: string) => {
    setFullScreenPanelID(id);
  }, []);

  const exitFullScreen = React.useCallback(() => {
    setFullScreenPanelID(null);
  }, []);

  const fullScreenPanel = fullScreenPanelID ? view.panels.findByID(fullScreenPanelID) : null;

  const inFullScreen = !!fullScreenPanel;
  return {
    viewPanelInFullScreen,
    exitFullScreen,
    inFullScreen,
    fullScreenPanel,
  };
}
