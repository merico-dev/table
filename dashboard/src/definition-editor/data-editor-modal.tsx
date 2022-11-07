import { Modal, Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { LayoutStateContext } from '../contexts/layout-state-context';
import { EditQueries } from './query-editor';
import { EditSQLSnippets } from './sql-snippet-editor';

interface IDataEditorModal {
  opened: boolean;
  close: () => void;
}

export const DataEditorModal = observer(function _DataEditorModal({ opened, close }: IDataEditorModal) {
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
          <Tabs.Tab value="SQL Snippets">SQL Snippets</Tabs.Tab>
          <Tabs.Tab value="Queries">Queries</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="SQL Snippets" pt="sm">
          <EditSQLSnippets />
        </Tabs.Panel>
        <Tabs.Panel value="Queries" pt="sm">
          <EditQueries />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
});
