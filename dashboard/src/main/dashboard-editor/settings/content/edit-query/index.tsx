import { Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryEditor } from './query-editor/editor';

export const EditQuery = observer(({ id }: { id: string }) => {
  if (id === '') {
    return null;
  }
  return (
    <Stack sx={{ height: '100%' }} spacing="sm">
      <QueryEditor id={id} />
    </Stack>
  );
});
