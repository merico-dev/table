import { AppShell, Group } from "@mantine/core";
import React from "react";
import { ContextAndSnippets } from "./context-and-snippets";
import { DataPreview } from "./data-preview";
import { QueryEditor } from "./editor";
import { SelectOrAddQuery } from "./select-or-add-data-source";

interface IEditQueries {
}

export function EditQueries({ }: IEditQueries) {
  const [id, setID] = React.useState('');

  return (
    <AppShell
      sx={{
        height: '90vh', maxHeight: 'calc(100vh - 225px)',
        '.mantine-AppShell-body': { height: '100%' },
        main: { height: '100%', width: '100%', padding: 0, margin: 0 }
      }}
      padding="md"
    >
      <Group direction="row" position="apart" grow align="stretch" noWrap>
        <Group direction="column" grow sx={{ flexGrow: 1, maxWidth: 'calc(60% - 16px)' }}>
          <SelectOrAddQuery id={id} setID={setID} />
          <QueryEditor id={id} setID={setID} />
        </Group>
        <ContextAndSnippets />
      </Group>
      <DataPreview id={id} />
    </AppShell>
  )
}