import { AppShell, LoadingOverlay, Modal, Navbar, Tabs } from "@mantine/core";
import React from "react";
import { LayoutStateContext } from "../contexts/layout-state-context";
import { EditQueries } from "./data-source-editor";
import { EditSQLSnippets } from "./sql-snippet-editor";

interface IDataEditorModal {
  opened: boolean;
  close: () => void;
}

export function DataEditorModal({ opened, close }: IDataEditorModal) {
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
      title='Data Settings'
      trapFocus
      onDragStart={e => { e.stopPropagation() }}
    >
      <Tabs>
        <Tabs.Tab label="SQL Snippet">
          <EditSQLSnippets />
        </Tabs.Tab>
        <Tabs.Tab label="Data Source">
          <EditQueries />
        </Tabs.Tab>
      </Tabs>
    </Modal>
  )
}