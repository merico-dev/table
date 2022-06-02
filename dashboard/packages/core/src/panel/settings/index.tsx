import { AppShell, LoadingOverlay, Modal, Navbar, Tabs } from "@mantine/core";
import React from "react";
import { LayoutStateContext } from "../../contexts/layout-state-context";
import { PanelContext } from "../../contexts/panel-context";
import { ErrorBoundary } from "../error-boundary";
import { Viz } from "../viz";
import { ContextInfo } from "./context-info";
import { QueryEditor } from "./query-editor";
import { QueryResult } from "./query-result";
import { SQLSnippetsTab } from "./sql-snippets";
import { VizConfig } from "./viz-config";

interface IPanelSettingsModal {
  opened: boolean;
  close: () => void;
}

export function PanelSettingsModal({ opened, close }: IPanelSettingsModal) {
  const { freezeLayout } = React.useContext(LayoutStateContext);
  const { data, loading, viz, title } = React.useContext(PanelContext)

  React.useEffect(() => {
    freezeLayout(opened);
  }, [opened]);

  return (
    <Modal
      size="96vw"
      overflow="inside"
      opened={opened}
      onClose={close}
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
  )
}