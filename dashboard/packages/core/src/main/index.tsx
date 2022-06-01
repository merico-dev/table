import React from "react";
import _ from "lodash";
import { DashboardMode, IDashboard, IDashboardPanel, ISQLSnippet } from "../types/dashboard";
import { LayoutStateContext } from "../contexts/layout-state-context";
import { DashboardLayout } from "../layout";
import { DashboardActions } from "./actions";
import { DefinitionContext } from "../contexts/definition-context";

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
  const [panels, setPanels] = React.useState<IDashboardPanel[]>(dashboard.panels)
  const [sqlSnippets, setSQLSnippets] = React.useState<ISQLSnippet[]>(dashboard.definition.sqlSnippets);
  const [mode, setMode] = React.useState<DashboardMode>(DashboardMode.Edit)

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
    setPanels(panels => ([...panels, newItem]));
  }

  const removePanelByID = (id: string) => {
    setPanels(panels => _.reject(panels, { id }));
  }

  const inEditMode = mode === DashboardMode.Edit;
  return (
    <div className={className}>
      <DefinitionContext.Provider value={{ sqlSnippets, setSQLSnippets }}>
        <LayoutStateContext.Provider value={{ layoutFrozen, freezeLayout, mode, inEditMode }}>
          <DashboardActions
            mode={mode}
            setMode={setMode}
            addPanel={addPanel}
            saveChanges={updateDashboard}
          />
          <DashboardLayout
            panels={panels}
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