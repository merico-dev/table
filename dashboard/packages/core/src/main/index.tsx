import React from "react";
import _ from "lodash";
import { DashboardMode, IDashboard, ISQLSnippet } from "../types/dashboard";
import { LayoutStateContext } from "../contexts/layout-state-context";
import { DashboardLayout } from "../layout";
import { DashboardActions } from "./actions";
import { DefinitionContext } from "../contexts/definition-context";
import { useListState } from "@mantine/hooks";

interface IDashboardProps {
  dashboard: IDashboard;
  className?: string;
}

export function Dashboard({
  dashboard,
  className = "dashboard",
}: IDashboardProps) {
  const [layoutFrozen, freezeLayout] = React.useState(false);
  const [newCounter, setNewCounter] = React.useState(0)
  const [breakpoint, setBreakpoint] = React.useState()
  const [localCols, setLocalCols] = React.useState()
  const [panels, setPanels] = useListState(dashboard.panels)
  const [sqlSnippets, setSQLSnippets] = React.useState<ISQLSnippet[]>(dashboard.definition.sqlSnippets);
  const [mode, setMode] = React.useState<DashboardMode>(DashboardMode.Edit)

  const hasChanges = React.useMemo(() => {
    return !_.isEqual(panels, dashboard.panels) || !_.isEqual(sqlSnippets, dashboard.definition.sqlSnippets);
  }, [dashboard, panels, sqlSnippets])

  const updateDashboard = () => {
    const d: IDashboard = _.merge({}, dashboard, { panels }, { definition: { sqlSnippets }})
    console.log(d)
  }

  const addPanel = () => {
    /*eslint no-console: 0*/
    console.log("adding", "n" + newCounter);
    setNewCounter(v => v + 1)
    const id = "n" + newCounter;
    const newItem = {
      id,
      layout: {
        x: (panels.length * 2) % (localCols || 12),
        y: Infinity, // puts it at the bottom
        w: 4,
        h: 4,
      },
      title: `New Panel - ${id}`,
      description: "description goes here",
      sql: '',
      viz: {
        type: 'table',
        conf: {},
      }
    };
    setPanels.append(newItem);
  }

  const removePanelByID = (id: string) => {
    const index = panels.findIndex(p => p.id === id);
    setPanels.remove(index);
  }

  const inEditMode = mode === DashboardMode.Edit;
  return (
    <div className={className}>
      <DefinitionContext.Provider value={{ sqlSnippets, setSQLSnippets }}>
        <LayoutStateContext.Provider value={{ layoutFrozen, freezeLayout, mode, inEditMode }}>
          <DashboardActions
            mode={mode}
            setMode={setMode}
            hasChanges={hasChanges}
            addPanel={addPanel}
            saveChanges={updateDashboard}
          />
          <DashboardLayout
            panels={panels}
            setPanels={setPanels}
            isDraggable={inEditMode && !layoutFrozen}
            isResizable={inEditMode && !layoutFrozen}
            onRemoveItem={removePanelByID}
            setLocalCols={setLocalCols}
            setBreakpoint={setBreakpoint}
          />
        </LayoutStateContext.Provider>
      </DefinitionContext.Provider>
    </div >
  )
}