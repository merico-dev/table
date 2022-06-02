import { ActionIcon, AppShell, Button, Group, LoadingOverlay, Modal, Navbar, Tabs } from "@mantine/core";
import React from "react";
import { Settings } from "tabler-icons-react";
import { LayoutStateContext } from "../../contexts/layout-state-context";
import { PanelContext } from "../../contexts/panel-context";
import { ErrorBoundary } from "../error-boundary";
import { Viz } from "../viz";
import { ContextInfo } from "./context-info";
import { QueryEditor } from "./query-editor";
import { QueryResult } from "./query-result";
import { SQLSnippetsTab } from "./sql-snippets";
import { VizConfig } from "./viz-config";

interface IPanelSettings {
}

export function PanelSettings({ }: IPanelSettings) {
  const { freezeLayout } = React.useContext(LayoutStateContext);
  const { data, loading, viz, title } = React.useContext(PanelContext)

  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);

  React.useEffect(() => {
    freezeLayout(opened);
  }, [opened]);

  return (
    <>
      <Modal
        size="96vw"
        overflow="inside"
        opened={opened}
        onClose={() => setOpened(false)}
        title={title}
        trapFocus
        onDragStart={e => { e.stopPropagation() }}
      >
        <AppShell
          sx={{
            height: '90vh', maxHeight: 'calc(100vh - 185px)',
            '.mantine-AppShell-body': { height: '100%' },
            main: { height: '100%', width: '100%' }
          }}
          padding="md"
          navbar={(
            <Navbar width={{ base: '40%' }} height="100%" p="xs">
              <Tabs initialTab={1}>
                <Tabs.Tab label="Context">
                  <ContextInfo />
                </Tabs.Tab>
                <Tabs.Tab label="SQL Snippets">
                  <SQLSnippetsTab />
                </Tabs.Tab>
                <Tabs.Tab label="SQL">
                  <QueryEditor />
                </Tabs.Tab>
                <Tabs.Tab label="Data">
                  <LoadingOverlay visible={loading} />
                  <QueryResult />
                </Tabs.Tab>
                <Tabs.Tab label="Viz Config">
                  <VizConfig />
                </Tabs.Tab>
              </Tabs>
            </Navbar>
          )}
        >
          <ErrorBoundary>
            <Viz viz={viz} data={data} loading={loading} />
          </ErrorBoundary>
        </AppShell>
      </Modal>
      <ActionIcon variant="hover" color="blue" loading={loading} onClick={open}>
        <Settings size={16} />
      </ActionIcon>
    </>
  )
}