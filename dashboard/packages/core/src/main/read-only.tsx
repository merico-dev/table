import React from "react";
import _ from "lodash";
import { DashboardMode, IDashboard, IDashboardConfig } from "../types/dashboard";
import { LayoutStateContext } from "../contexts/layout-state-context";
import { DefinitionContext } from "../contexts/definition-context";
import { ReadOnlyDashboardLayout } from "../layout/read-only";
import { ContextInfoContext, ContextInfoContextType } from "../contexts";
import { APIClient } from "../api-caller/request";

interface IReadOnlyDashboard {
  context: ContextInfoContextType;
  dashboard: IDashboard;
  className?: string;
  config: IDashboardConfig;
}

export function ReadOnlyDashboard({
  context,
  dashboard,
  className = "dashboard",
  config,
}: IReadOnlyDashboard) {
  if (APIClient.baseURL !== config.apiBaseURL) {
    APIClient.baseURL = config.apiBaseURL;
  }

  const definition = React.useMemo(() => ({
    ...dashboard.definition,
    setSQLSnippets: () => { },
    setQueries: () => { },
  }), [dashboard]);

  return (
    <ContextInfoContext.Provider value={context}>
      <div className={className}>
        <DefinitionContext.Provider value={definition}>
          <LayoutStateContext.Provider value={{ layoutFrozen: true, freezeLayout: () => { }, mode: DashboardMode.Use, inEditMode: false, inLayoutMode: false, inUseMode: true }}>
            <ReadOnlyDashboardLayout panels={dashboard.panels} />
          </LayoutStateContext.Provider>
        </DefinitionContext.Provider>
      </div >
    </ContextInfoContext.Provider>
  )
}