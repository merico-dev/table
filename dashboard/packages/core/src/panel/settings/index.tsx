import { AppShell, Group, LoadingOverlay, Modal, Navbar, Tabs } from "@mantine/core";
import React from "react";
import { LayoutStateContext } from "../../contexts/layout-state-context";
import { PanelContext } from "../../contexts/panel-context";
import { ErrorBoundary } from "../error-boundary";
import { Viz } from "../viz";
import { PanelConfig } from "./panel-config";
import { PickDataSource } from "./pick-data-source";
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
      >
        <Tabs initialTab={2}>
          <Tabs.Tab label="Data Source">
            <LoadingOverlay visible={loading} exitTransitionDuration={0} />
            <PickDataSource />
          </Tabs.Tab>
          <Tabs.Tab label="Panel">
            <PanelConfig />
          </Tabs.Tab>
          <Tabs.Tab label="Visualization">
            <VizConfig />
          </Tabs.Tab>
        </Tabs>
      </AppShell>
    </Modal>
  )
}