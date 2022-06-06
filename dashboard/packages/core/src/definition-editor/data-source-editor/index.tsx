import { AppShell, LoadingOverlay, Modal, Navbar, Tabs } from "@mantine/core";
import React from "react";
import { LayoutStateContext } from "../../contexts/layout-state-context";
import { DataPreview } from "./data-preview";
import { DataSourceEditor } from "./editor";
import { SelectOrAddDataSource } from "./select-or-add-data-source";

interface IEditDataSourcesModal {
  opened: boolean;
  close: () => void;
}

export function EditDataSourcesModal({ opened, close }: IEditDataSourcesModal) {
  const [id, setID] = React.useState('');
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
      title='Data Sources'
      trapFocus
      onDragStart={e => { e.stopPropagation() }}
    >
      <AppShell
        sx={{
          height: '90vh', maxHeight: 'calc(100vh - 185px)',
          '.mantine-AppShell-body': { height: '100%' },
          main: { height: '100%', width: '100%', padding: 0, margin: 0 }
        }}
        padding="md"
        header={<SelectOrAddDataSource id={id} setID={setID} />}
      >
        <DataSourceEditor id={id} />
        <DataPreview id={id} />
      </AppShell>
    </Modal>
  )
}