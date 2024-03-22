import { ActionIcon, Group, JsonInput, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceFloppy } from 'tabler-icons-react';
import { useEditContentModelContext } from '~/contexts';

export const EditMockContext = observer(() => {
  const { t } = useTranslation();
  const content = useEditContentModelContext();
  const [v, setV] = useState(() => JSON.stringify(content.mock_context.current, null, 4));
  const submit = () => {
    try {
      content.mock_context.replace(JSON.parse(v));
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
      return JSON.stringify(JSON.parse(v)) !== JSON.stringify(content.mock_context.current);
    } catch (error) {
      return false;
    }
  }, [v, content.mock_context.current]);

  return (
    <Stack sx={{ border: '1px solid #eee', borderLeft: 'none', borderRight: 'none', flexGrow: 1, maxWidth: 'unset' }}>
      <Group
        position="left"
        pl="md"
        py="md"
        sx={{ borderBottom: '1px solid #eee', background: '#efefef', flexGrow: 0 }}
      >
        <Text weight={500}>{t('mock_context.label')}</Text>
      </Group>
      <Group grow px="md" pb="md" pt={0} sx={{ flexGrow: 1, position: 'relative', alignItems: 'flex-start' }}>
        <Stack spacing={10} sx={{ maxWidth: 'unset !important' }}>
          <Text>{t('mock_context.hint')}</Text>
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
