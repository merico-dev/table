import React from "react";
import _ from "lodash";
import { DashboardMode, IDashboard, ISQLSnippet } from "../types/dashboard";
import { LayoutStateContext } from "../contexts/layout-state-context";
import { DashboardLayout } from "../layout";
import { DashboardActions } from "./actions";
import { DefinitionContext } from "../contexts/definition-context";
import { randomId, useListState } from "@mantine/hooks";

interface IDashboardProps {
  dashboard: IDashboard;
  className?: string;
  update: (dashboard: IDashboard) => Promise<void>;
}

export function Dashboard({
  dashboard,
  update,
  className = "dashboard",
}: IDashboardProps) {
  const [layoutFrozen, freezeLayout] = React.useState(false);
  const [breakpoint, setBreakpoint] = React.useState()
  const [localCols, setLocalCols] = React.useState()
  const [panels, setPanels] = useListState(dashboard.panels)
  const [sqlSnippets, setSQLSnippets] = React.useState<ISQLSnippet[]>(dashboard.definition.sqlSnippets);
  const [mode, setMode] = React.useState<DashboardMode>(DashboardMode.Edit)

  const hasChanges = React.useMemo(() => {
    // local panels' layouts would contain some undefined runtime values
    const cleanJSON = (v: any) => JSON.parse(JSON.stringify(v));

    const panelsEqual = _.isEqual(cleanJSON(panels), cleanJSON(dashboard.panels));
    if (!panelsEqual) {
      return true;
    }

    return !_.isEqual(sqlSnippets, dashboard.definition.sqlSnippets);
  }, [dashboard, panels, sqlSnippets])

  const saveDashboardChanges = async () => {
    const d: IDashboard = _.merge({}, dashboard, { panels }, { definition: { sqlSnippets }})
    await update(d);
  }

  const addPanel = () => {
    const id = randomId();
    const newItem = {
      id,
      layout: {
        x: 0,
        y: Infinity, // puts it at the bottom
        w: 3,
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

  const definitions = React.useMemo(() => ({ sqlSnippets, setSQLSnippets }), [sqlSnippets, setSQLSnippets]);

  return (
    <div className={className}>
      <DefinitionContext.Provider value={definitions}>
        <LayoutStateContext.Provider value={{ layoutFrozen, freezeLayout, mode, inEditMode }}>
          <DashboardActions
            mode={mode}
            setMode={setMode}
            hasChanges={hasChanges}
            addPanel={addPanel}
            saveChanges={saveDashboardChanges}
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