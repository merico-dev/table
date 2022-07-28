import { AppShell, Group } from "@mantine/core";
import React from "react";
import { GlobalVariablesGuide } from "../global-variables-guide";
import { SQLSnippetsEditor } from "./editor";

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
        <GlobalVariablesGuide showSQLSnippets={false} />
      </Group>
    </AppShell>
  )
}