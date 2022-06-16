import React from "react";
import _ from "lodash";
import { DashboardMode, IDashboard, IDataSource, ISQLSnippet } from "../types/dashboard";
import { LayoutStateContext } from "../contexts/layout-state-context";
import { DashboardLayout } from "../layout";
import { DashboardActions } from "./actions";
import { DefinitionContext } from "../contexts/definition-context";
import { randomId } from "@mantine/hooks";
import { ContextInfoContext, ContextInfoContextType } from "../contexts";

interface IDashboardProps {
  context: ContextInfoContextType;
  dashboard: IDashboard;
  className?: string;
  update: (dashboard: IDashboard) => Promise<void>;
}

export function Dashboard({
  context,
  dashboard,
  update,
  className = "dashboard",
}: IDashboardProps) {
  const [layoutFrozen, freezeLayout] = React.useState(false);
  const [breakpoint, setBreakpoint] = React.useState()
  const [localCols, setLocalCols] = React.useState()
  const [panels, setPanels] = React.useState(dashboard.panels)
  const [sqlSnippets, setSQLSnippets] = React.useState<ISQLSnippet[]>(dashboard.definition.sqlSnippets);
  const [dataSources, setDataSources] = React.useState<IDataSource[]>(dashboard.definition.dataSources);
  const [mode, setMode] = React.useState<DashboardMode>(DashboardMode.Edit)

  const hasChanges = React.useMemo(() => {
    // local panels' layouts would contain some undefined runtime values
    const cleanJSON = (v: any) => JSON.parse(JSON.stringify(v));

    const panelsEqual = _.isEqual(cleanJSON(panels), cleanJSON(dashboard.panels));
    if (!panelsEqual) {
      return true;
    }

    if (!_.isEqual(sqlSnippets, dashboard.definition.sqlSnippets)) {
      return true;
    };
    return !_.isEqual(dataSources, dashboard.definition.dataSources)
  }, [dashboard, panels, sqlSnippets, dataSources])

  const saveDashboardChanges = async () => {
    const d: IDashboard = {
      ...dashboard,
      panels,
      definition: { sqlSnippets, dataSources },
    }
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
      dataSourceID: '',
      viz: {
        type: 'table',
        conf: {},
      }
    };
    setPanels(prevs => ([...prevs, newItem]));
  }

  const removePanelByID = (id: string) => {
    const index = panels.findIndex(p => p.id === id);
    setPanels(prevs => {
      prevs.splice(index, 1)
      return [...prevs];
    })
  }

  const inEditMode = mode === DashboardMode.Edit;
  const inLayoutMode = mode === DashboardMode.Layout;
  const inUseMode = mode === DashboardMode.Use;

  const definitions = React.useMemo(() => ({
    sqlSnippets, setSQLSnippets,
    dataSources, setDataSources,
  }), [sqlSnippets, setSQLSnippets, dataSources, setDataSources]);

  return (
    <ContextInfoContext.Provider value={context}>
      <div className={className}>
        <DefinitionContext.Provider value={definitions}>
          <LayoutStateContext.Provider value={{ layoutFrozen, freezeLayout, mode, inEditMode, inLayoutMode, inUseMode }}>
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
              isDraggable={inLayoutMode}
              isResizable={inLayoutMode}
              onRemoveItem={removePanelByID}
              setLocalCols={setLocalCols}
              setBreakpoint={setBreakpoint}
            />
          </LayoutStateContext.Provider>
        </DefinitionContext.Provider>
      </div >
    </ContextInfoContext.Provider>
  )
}