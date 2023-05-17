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
  const original = useMemo(() => stableStringify(props.base, { space: 2 }) ?? '', [props.base]);
  const modified = useMemo(() => stableStringify(props.changed, { space: 2 }) ?? '', [props.changed]);
  return (
    <Stack style={{ height: 'calc(100vh - 300px)' }}>
      <Group position="apart" px="xs">
        <Text size={12}>Base</Text>
        <Text size={12}>Modified</Text>
      </Group>
      <DiffEditor
        height="100%"
        options={{
          readOnly: true,
          folding: false,
          wordWrap: 'on',
          minimap: {
            enabled: false,
          },
        }}
        original={original}
        modified={modified}
        originalLanguage="json"
        modifiedLanguage="json"
      />
    </Stack>
  );
};
