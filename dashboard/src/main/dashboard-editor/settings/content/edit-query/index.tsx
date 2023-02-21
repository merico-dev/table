import { Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryEditor } from '~/definition-editor/query-editor/editor';

export const EditQuery = observer(({ id }: { id: string }) => {
  return (
    <Stack sx={{ height: '100%' }} spacing="sm">
      <QueryEditor id={id} />
    </Stack>
  );
});
