import { AppShell, Group, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { GlobalVariablesGuide } from '../global-variables-guide';
import { DataPreview } from './data-preview';
import { QueryEditor } from './editor';
import { SelectOrAddQuery } from './select-or-add-query';

export const EditQueries = observer(function _EditQueries() {
  const [id, setID] = React.useState('');

  return (
    <AppShell
      sx={{
        height: '90vh',
        maxHeight: 'calc(100vh - 225px)',
        '.mantine-AppShell-body': { height: '100%' },
        main: { height: '100%', width: '100%', padding: 0, margin: 0 },
      }}
      padding="md"
    >
      <Group position="apart" grow align="stretch" noWrap>
        <Stack sx={{ flexGrow: 1, maxWidth: 'calc(60% - 16px)' }}>
          <SelectOrAddQuery id={id} setID={setID} />
          <QueryEditor id={id} setID={setID} />
        </Stack>
        <GlobalVariablesGuide />
      </Group>
      <DataPreview id={id} />
    </AppShell>
  );
});
