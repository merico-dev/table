import { AnyObject } from '@devtable/dashboard';
import { DiffEditor } from '@monaco-editor/react';
import stableStringify from 'json-stable-stringify';
import { useMemo } from 'react';
import { Group, Stack, Text } from '@mantine/core';

export interface IJsonChangesViewerProps {
  base?: AnyObject;
  changed?: AnyObject;
}

export const JsonChangesViewer = (props: IJsonChangesViewerProps) => {
  const original = useMemo(() => stableStringify(props.base, { space: 2 }), [props.base]);
  const modified = useMemo(() => stableStringify(props.changed, { space: 2 }), [props.changed]);

  return (
    <Stack style={{ height: '70vh' }}>
      <Group position="apart">
        <Text>Base</Text>
        <Text>Modified</Text>
      </Group>
      <DiffEditor
        options={{ readOnly: true }}
        original={original}
        modified={modified}
        originalLanguage="json"
        modifiedLanguage="json"
      />
    </Stack>
  );
};
