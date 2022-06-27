import { AppShell, Group } from "@mantine/core";
import React from "react";
import { ContextInfo } from "./context-info";
import { SQLSnippetsEditor } from "./editor";
import { SQLSnippetGuide } from "./guide";

interface IEditSQLSnippets {
}

export function EditSQLSnippets({ }: IEditSQLSnippets) {
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
        <SQLSnippetsEditor />
        <Group direction="column" grow noWrap sx={{ maxWidth: '40%' }}>
          <SQLSnippetGuide />
          <ContextInfo />
        </Group>
      </Group>
    </AppShell>
  )
}