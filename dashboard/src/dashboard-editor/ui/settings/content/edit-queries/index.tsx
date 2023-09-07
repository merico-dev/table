import { Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEditContentModelContext } from '~/contexts';

export const EditQueries = observer(() => {
  const content = useEditContentModelContext();

  return (
    <Stack sx={{ height: '100%' }} spacing="sm">
      FOO
    </Stack>
  );
});
