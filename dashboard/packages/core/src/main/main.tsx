import React from "react";
import _ from "lodash";
import { DashboardMode, IDashboard, IQuery, ISQLSnippet, IDashboardConfig } from "../types/dashboard";
import { LayoutStateContext } from "../contexts/layout-state-context";
import { DashboardLayout } from "../layout";
import { DashboardActions } from "./actions";
import { DefinitionContext } from "../contexts/definition-context";
import { randomId } from "@mantine/hooks";
import { ContextInfoContext, ContextInfoContextType } from "../contexts";
import { APIClient } from "../api-caller/request";
import { DashboardActionContext } from "../contexts/dashboard-action-context";
import { ModalsProvider } from '@mantine/modals';

interface IDashboardProps {
  context: ContextInfoContextType;
  dashboard: IDashboard;
  className?: string;
  update: (dashboard: IDashboard) => Promise<void>;
  config: IDashboardConfig;
}

export function Dashboard({
  context,
  dashboard,
  update,
  className = "dashboard",
  config,
}: IDashboardProps) {
  if (APIClient.baseURL !== config.apiBaseURL) {
    APIClient.baseURL = config.apiBaseURL;
  }

  const [layoutFrozen, freezeLayout] = React.useState(false);
  const [panels, setPanels] = React.useState(dashboard.panels)
  const [sqlSnippets, setSQLSnippets] = React.useState<ISQLSnippet[]>(dashboard.definition.sqlSnippets);
  const [queries, setQueries] = React.useState<IQuery[]>(dashboard.definition.queries);
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
    return !_.isEqual(queries, dashboard.definition.queries)
  }, [dashboard, panels, sqlSnippets, queries])

  const saveDashboardChanges = async () => {
    const d: IDashboard = {
      ...dashboard,
      panels,
      definition: { sqlSnippets, queries },
    }
    await update(d);
  }

  const revertDashboardChanges = () => {
    setPanels(dashboard.panels)
    setSQLSnippets(dashboard.definition.sqlSnippets)
    setQueries(dashboard.definition.queries)
  }

  const addPanel = () => {
    const id = randomId();
    const newItem = {
      id,
      layout: {
        x: 0,
        y: Infinity, // puts it at the bottom
        w: 3,
        h: 15,
      },
      title: `Panel - ${id}`,
      description: '<p><br></p>',
      queryID: '',
      viz: {
        type: 'text',
        conf: {},
      }
    };
    setPanels(prevs => ([...prevs, newItem]));
  }

  const duplidatePanel = (id: string) => {
    try {
      const panel = panels.find(p => p.id === id)
      if (!panel) {
        throw new Error(`[duplicate panel] Can't find a panel by id[${id}]`)
      }
      const newPanel = {
        ...panel,
        id: randomId(),
        layout: {
          ...panel.layout,
          x: 0,
          y: Infinity,
        }
      }
      setPanels(prevs => ([...prevs, newPanel]))
    } catch (error) {
      console.error(error)
    }
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
    queries, setQueries,
  }), [sqlSnippets, setSQLSnippets, queries, setQueries]);

  const getCurrentSchema = React.useCallback(() => {
    return {
      panels,
      definition: {
        sqlSnippets,
        queries,
      }
    }
  }, [sqlSnippets, queries, panels])

  return (
    <ModalsProvider>
      <ContextInfoContext.Provider value={context}>
        <DashboardActionContext.Provider value={{ addPanel, duplidatePanel, removePanelByID }}>
          <DefinitionContext.Provider value={definitions}>
            <LayoutStateContext.Provider value={{ layoutFrozen, freezeLayout, mode, inEditMode, inLayoutMode, inUseMode }}>
              <div className={className}>
                <DashboardActions
                  mode={mode}
                  setMode={setMode}
                  hasChanges={hasChanges}
                  saveChanges={saveDashboardChanges}
                  revertChanges={revertDashboardChanges}
                  getCurrentSchema={getCurrentSchema}
                />
                <DashboardLayout
                  panels={panels}
                  setPanels={setPanels}
                  isDraggable={inLayoutMode}
                  isResizable={inLayoutMode}
                />
              </div >
            </LayoutStateContext.Provider>
          </DefinitionContext.Provider>
        </DashboardActionContext.Provider>
      </ContextInfoContext.Provider>
    </ModalsProvider>
  )
}