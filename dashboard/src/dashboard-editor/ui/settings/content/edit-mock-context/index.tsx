import { ActionIcon, Button, Group, JsonInput, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
        justify="flex-start"
        pl="md"
        py="md"
        sx={{ borderBottom: '1px solid #eee', background: '#efefef', flexGrow: 0 }}
      >
        <Text size="sm" fw={500}>
          {t('mock_context.label')}
        </Text>
      </Group>
      <Group grow px="md" pb="md" pt={0} sx={{ flexGrow: 1, position: 'relative', alignItems: 'flex-start' }}>
        <Stack gap={10} sx={{ maxWidth: 'unset !important' }}>
          <Group justify="flex-start">
            <Text size="sm">{t('mock_context.hint')}</Text>
            <Button
              color="green"
              size="compact-sm"
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={submit}
              disabled={!changed}
            >
              {t('common.actions.save')}
            </Button>
          </Group>
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
      </Group>
    </Stack>
  );
});
