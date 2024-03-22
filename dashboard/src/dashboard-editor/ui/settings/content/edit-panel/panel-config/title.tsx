import { Checkbox, Group, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditPanelContext } from '~/contexts/panel-context';

export const EditTitle = observer(() => {
  const { t } = useTranslation();
  const { panel } = useEditPanelContext();

  return (
    <Stack spacing={6} mb={10}>
      <Group pl={6} position="left" spacing={20}>
        <Checkbox
          size="sm"
          checked={panel.title.show}
          onChange={(event) => panel.title.setShow(event.currentTarget.checked)}
          label={t('panel.show_title')}
          sx={{ userSelect: 'none' }}
        />
        <Checkbox size="sm" checked disabled label={t('panel.use_name_as_title')} />
      </Group>
    </Stack>
  );
});
