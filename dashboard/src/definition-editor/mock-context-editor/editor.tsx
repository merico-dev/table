import { ActionIcon, Group, JsonInput, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { useModelContext } from '../../contexts';

export const MockContextEditor = observer(function _MockContextEditor() {
  const model = useModelContext();
  const [v, setV] = useState(() => JSON.stringify(model.mock_context, null, 4));
  const submit = () => {
    try {
      model.setMockContext(JSON.parse(v));
    } catch (error) {
      showNotification({
        title: 'Failed',
        // @ts-expect-error error's type
        message: error.message,
        color: 'red',
      });
    }
  };

  const changed = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(v)) !== JSON.stringify(model.mock_context);
    } catch (error) {
      return false;
    }
  }, [v, model.mock_context]);

  return (
    <Stack sx={{ border: '1px solid #eee', flexGrow: 1, maxWidth: 'unset' }}>
      <Group
        position="left"
        pl="md"
        py="md"
        sx={{ borderBottom: '1px solid #eee', background: '#efefef', flexGrow: 0 }}
      >
        <Text weight={500}>Mock Context</Text>
      </Group>
      <Group grow px="md" pb="md" pt={0} sx={{ flexGrow: 1, position: 'relative' }}>
        <Stack spacing={10} sx={{ maxWidth: 'unset !important' }}>
          <Text>A valid json string is required</Text>
          <JsonInput
            validationError="Invalid json"
            formatOnBlur
            autosize
            minRows={30}
            value={v}
            onChange={setV}
            sx={{ flexGrow: 1 }}
          />
        </Stack>
        <ActionIcon
          mr={5}
          variant="filled"
          color="blue"
          sx={{ position: 'absolute', right: 12, top: 0 }}
          disabled={!changed}
          onClick={submit}
        >
          <DeviceFloppy size={20} />
        </ActionIcon>
      </Group>
    </Stack>
  );
});
