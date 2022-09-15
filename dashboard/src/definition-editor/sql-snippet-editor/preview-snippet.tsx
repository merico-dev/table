import { Stack, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import React from 'react';
import { useModelContext } from '../../contexts/model-context';
import { explainSQLSnippet } from '../../utils/sql';

interface IPreviewSnippet {
  value: string;
}

export function PreviewSnippet({ value }: IPreviewSnippet) {
  const model = useModelContext();
  const context = model.context.current;
  const explained = React.useMemo(() => {
    return explainSQLSnippet(value, context);
  }, [value, context]);

  return (
    <Stack>
      <Text>Preview</Text>
      <Prism language="sql" noCopy colorScheme="dark">
        {explained}
      </Prism>
    </Stack>
  );
}
