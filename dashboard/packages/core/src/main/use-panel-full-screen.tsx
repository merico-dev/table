import React from "react";
import { IDashboardPanel } from "../types";

export function usePanelFullScreen(panels: IDashboardPanel[]) {
  const [fullScreenPanelID, setFullScreenPanelID] = React.useState<string|null>(null)
  const viewPanelInFullScreen = React.useCallback((id: string) => {
    setFullScreenPanelID(id);
  }, [])

  const exitFullScreen = React.useCallback(() => {
    setFullScreenPanelID(null)
  }, [])

  const fullScreenPanel = React.useMemo(() => {
    return panels.find(p => p.id === fullScreenPanelID)
  }, [fullScreenPanelID, panels]);

  const inFullScreen = !!fullScreenPanel;
  return {
    viewPanelInFullScreen,
    exitFullScreen,
    inFullScreen,
    fullScreenPanel,
  }
}