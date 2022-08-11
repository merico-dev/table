import { Modal, Tabs } from '@mantine/core';
import React from 'react';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { DashboardModelInstance } from '../model';
import { EditQueries } from './query-editor';
import { EditSQLSnippets } from './sql-snippet-editor';

interface IDataEditorModal {
  opened: boolean;
  close: () => void;
  model: DashboardModelInstance;
}

export function DataEditorModal({ opened, close, model }: IDataEditorModal) {
  const { freezeLayout } = React.useContext(LayoutStateContext);

  React.useEffect(() => {
    freezeLayout(opened);
  }, [opened]);

  return (
    <Modal
      size="96vw"
      overflow="inside"
      opened={opened}
      onClose={close}
      title="Data Settings"
      trapFocus
      onDragStart={(e) => {
        e.stopPropagation();
      }}
    >
      <Tabs defaultValue="Queries">
        <Tabs.List>
          <Tabs.Tab value="SQL Snippet">SQL Snippet</Tabs.Tab>
          <Tabs.Tab value="Queries">Queries</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="SQL Snippet" pt="sm">
          <EditSQLSnippets />
        </Tabs.Panel>
        <Tabs.Panel value="Queries" pt="sm">
          <EditQueries model={model} />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}
