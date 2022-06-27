import { AppShell, Group } from "@mantine/core";
import React from "react";
import { ContextAndSnippets } from "./context-and-snippets";
import { DataPreview } from "./data-preview";
import { DataSourceEditor } from "./editor";
import { SelectOrAddDataSource } from "./select-or-add-data-source";

interface IEditDataSources {
}

export function EditDataSources({ }: IEditDataSources) {
  const [id, setID] = React.useState('');

  return (
    <AppShell
      sx={{
        height: '90vh', maxHeight: 'calc(100vh - 185px)',
        '.mantine-AppShell-body': { height: '100%' },
        main: { height: '100%', width: '100%', padding: 0, margin: 0 }
      }}
      padding="md"
    >
      <Group direction="row" position="apart" grow align="stretch" noWrap>
        <div>
          <SelectOrAddDataSource id={id} setID={setID} />
          <DataSourceEditor id={id} setID={setID} />
        </div>
        <ContextAndSnippets />
      </Group>
      <DataPreview id={id} />
    </AppShell>
  )
}