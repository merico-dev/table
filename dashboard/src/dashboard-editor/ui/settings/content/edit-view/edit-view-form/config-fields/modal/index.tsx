import { Divider, Flex, Group, Stack, TextInput } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { EViewComponentType, ViewMetaInstance, ViewModalConfigInstance } from '~/model';
import { CustomModalTitleField } from './modal-title-editor';
import { useTranslation } from 'react-i18next';

export const ViewModalConfigFields = observer(({ view }: { view: ViewMetaInstance }) => {
  const { t } = useTranslation();
  if (!view || view.type !== EViewComponentType.Modal) {
    return null;
  }
  const config = view.config as ViewModalConfigInstance;
  const title = config.custom_modal_title.value;
  return (
    <Stack>
      <Divider mt={8} label={t('view.component.modal.modal_settings')} labelPosition="center" />
      <Flex gap={10}>
        <TextInput
          label={t('view.component.modal.title')}
          value={title}
          onChange={_.noop}
          disabled
          sx={{ flexGrow: 1 }}
        />
        <CustomModalTitleField value={config.custom_modal_title} onChange={config.custom_modal_title.replace} />
      </Flex>
      <Group grow>
        <TextInput
          label={t('view.component.modal.width')}
          value={config.width}
          onChange={(e) => config.setWidth(e.currentTarget.value)}
          placeholder="600px / 50vw"
        />
        <TextInput
          label={t('view.component.modal.height')}
          value={config.height}
          onChange={(e) => config.setHeight(e.currentTarget.value)}
          placeholder="600px / 50vw"
        />
      </Group>
    </Stack>
  );
});
