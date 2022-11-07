import { Stack, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useModelContext } from '../../contexts/model-context';
import { explainSQLSnippet } from '../../utils/sql';

interface IPreviewSnippet {
  value: string;
}

export const PreviewSnippet = observer(({ value }: IPreviewSnippet) => {
  const model = useModelContext();
  const context = model.context.current;
  const explained = React.useMemo(() => {
    return explainSQLSnippet(value, context, model.mock_context.current, model.filters.values);
  }, [value, context, model.mock_context.current]);

  return (
    <Stack>
      <Text>Preview</Text>
      <Prism language="sql" noCopy colorScheme="dark">
        {explained}
      </Prism>
    </Stack>
  );
});
