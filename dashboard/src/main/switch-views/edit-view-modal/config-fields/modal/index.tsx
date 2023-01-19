import { Divider, Flex, Group, Stack, TextInput } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { IViewConfigModel_Modal } from '~/model/views/view/modal';
import { EViewComponentType } from '~/types';
import { CustomModalTitleField } from './modal-title-editor';

export const ViewModalConfigFields = observer(() => {
  const model = useModelContext();
  const VIE = model.views.VIE;
  if (!VIE || VIE.type !== EViewComponentType.Modal) {
    return null;
  }
  const config = VIE.config as IViewConfigModel_Modal;
  const title = config.custom_modal_title.value;
  return (
    <Stack>
      <Divider mt={8} label="Modal settings" labelPosition="center" />
      <Flex gap={10}>
        <TextInput label="Modal Title" value={title} onChange={_.noop} disabled sx={{ flexGrow: 1 }} />
        <CustomModalTitleField value={config.custom_modal_title} onChange={config.custom_modal_title.replace} />
      </Flex>
      <Group grow>
        <TextInput
          label="Width"
          value={config.width}
          onChange={(e) => config.setWidth(e.currentTarget.value)}
          placeholder="600px / 50vw"
        />
        <TextInput
          label="Height"
          value={config.height}
          onChange={(e) => config.setHeight(e.currentTarget.value)}
          placeholder="600px / 50vw"
        />
      </Group>
    </Stack>
  );
});
