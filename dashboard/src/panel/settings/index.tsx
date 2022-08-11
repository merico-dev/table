import { AppShell, Group, LoadingOverlay, Modal, Navbar, Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { LayoutStateContext } from '../../contexts/layout-state-context';
import { PanelContext } from '../../contexts/panel-context';
import { DashboardModelInstance } from '../../model';
import { PanelConfig } from './panel-config';
import { PickQuery } from './pick-query';
import { VizConfig } from './viz-config';

interface IPanelSettingsModal {
  opened: boolean;
  close: () => void;
  model: DashboardModelInstance;
}

export const PanelSettingsModal = observer(function _PanelSettingsModal({ opened, close, model }: IPanelSettingsModal) {
  const { freezeLayout } = React.useContext(LayoutStateContext);
  const { data, loading, viz, title } = React.useContext(PanelContext);

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
      onDragStart={(e) => {
        e.stopPropagation();
      }}
    >
      <AppShell
        sx={{
          height: '90vh',
          maxHeight: 'calc(100vh - 185px)',
          '.mantine-AppShell-body': { height: '100%' },
          main: { height: '100%', width: '100%', padding: '16px' },
        }}
        padding="md"
      >
        <Tabs defaultValue="Visualization">
          <Tabs.List>
            <Tabs.Tab value="Data">Data</Tabs.Tab>
            <Tabs.Tab value="Panel">Panel</Tabs.Tab>
            <Tabs.Tab value="Visualization">Visualization</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="Data" pt="sm">
            <LoadingOverlay visible={loading} exitTransitionDuration={0} />
            <PickQuery model={model} />
          </Tabs.Panel>
          <Tabs.Panel value="Panel" pt="sm">
            <PanelConfig />
          </Tabs.Panel>
          <Tabs.Panel value="Visualization" pt="sm">
            <VizConfig />
          </Tabs.Panel>
        </Tabs>
      </AppShell>
    </Modal>
  );
});
