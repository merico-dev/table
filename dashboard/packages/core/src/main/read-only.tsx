import React from "react";
import _ from "lodash";
import { DashboardMode, IDashboard, ISQLSnippet } from "../types/dashboard";
import { LayoutStateContext } from "../contexts/layout-state-context";
import { DefinitionContext } from "../contexts/definition-context";
import { useListState } from "@mantine/hooks";
import { ReadOnlyDashboardLayout } from "../layout/read-only";

interface IReadOnlyDashboard {
  dashboard: IDashboard;
  className?: string;
}

export function ReadOnlyDashboard({
  dashboard,
  className = "dashboard",
}: IReadOnlyDashboard) {
  const [panels, setPanels] = useListState(dashboard.panels)
  const [sqlSnippets, setSQLSnippets] = React.useState<ISQLSnippet[]>(dashboard.definition.sqlSnippets);

  const definitions = React.useMemo(() => ({ sqlSnippets, setSQLSnippets }), [sqlSnippets, setSQLSnippets]);

  return (
    <div className={className}>
      <DefinitionContext.Provider value={definitions}>
        <LayoutStateContext.Provider value={{ layoutFrozen: true, freezeLayout: () => {}, mode: DashboardMode.Use, inEditMode: false }}>
          <ReadOnlyDashboardLayout panels={panels} />
        </LayoutStateContext.Provider>
      </DefinitionContext.Provider>
    </div >
  )
}