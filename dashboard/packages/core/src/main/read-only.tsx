import React from "react";
import _ from "lodash";
import { DashboardMode, IDashboard } from "../types/dashboard";
import { LayoutStateContext } from "../contexts/layout-state-context";
import { DefinitionContext } from "../contexts/definition-context";
import { ReadOnlyDashboardLayout } from "../layout/read-only";

interface IReadOnlyDashboard {
  dashboard: IDashboard;
  className?: string;
}

export function ReadOnlyDashboard({
  dashboard,
  className = "dashboard",
}: IReadOnlyDashboard) {
  const definition = React.useMemo(() => ({
    ...dashboard.definition,
    setSQLSnippets: () => {},
    setDataSources: () => {},
  }), [dashboard]);

  return (
    <div className={className}>
      <DefinitionContext.Provider value={definition}>
        <LayoutStateContext.Provider value={{ layoutFrozen: true, freezeLayout: () => {}, mode: DashboardMode.Use, inEditMode: false }}>
          <ReadOnlyDashboardLayout panels={dashboard.panels} />
        </LayoutStateContext.Provider>
      </DefinitionContext.Provider>
    </div >
  )
}