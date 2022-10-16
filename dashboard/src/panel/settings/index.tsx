import { AppShell, LoadingOverlay, Modal, Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { InteractionSettingsPanel } from '~/interactions/components/interaction-settings';
import { ErrorBoundary } from '~/panel/error-boundary';
import { LayoutStateContext } from '../../contexts/layout-state-context';
import { usePanelContext } from '../../contexts/panel-context';
import { PanelConfig } from './panel-config';
import { PickQuery } from './pick-query';
import { VizConfig } from './viz-config';

interface IPanelSettingsModal {
  opened: boolean;
  close: () => void;
}

export const PanelSettingsModal = observer(function _PanelSettingsModal({ opened, close }: IPanelSettingsModal) {
  const { freezeLayout } = React.useContext(LayoutStateContext);
  const [value, setValue] = useState<string | null>('Visualization');
  const { panel, loading } = usePanelContext();
  const { title } = panel;

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
          main: {
            height: '100%',
            minHeight: 'unset',
            maxHeight: '100%',
            width: '100%',
            padding: '16px',
          },
        }}
        padding="md"
      >
        <Tabs value={value} onTabChange={setValue} className="panel-settings-tabs">
          <Tabs.List>
            <Tabs.Tab value="Data">Data</Tabs.Tab>
            <Tabs.Tab value="Panel">Panel</Tabs.Tab>
            <Tabs.Tab value="Visualization">Visualization</Tabs.Tab>
            <Tabs.Tab value="Interactions">Interactions</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="Data" pt="sm">
            <LoadingOverlay visible={loading} exitTransitionDuration={0} />
            <PickQuery />
          </Tabs.Panel>
          <Tabs.Panel value="Panel" pt="sm">
            {value === 'Panel' && <PanelConfig />}
          </Tabs.Panel>
          <Tabs.Panel value="Visualization" pt="sm">
            {value === 'Visualization' && <VizConfig />}
          </Tabs.Panel>
          <Tabs.Panel value="Interactions" pt="sm">
            <ErrorBoundary>
              <InteractionSettingsPanel />
            </ErrorBoundary>
          </Tabs.Panel>
        </Tabs>
      </AppShell>
    </Modal>
  );
});
