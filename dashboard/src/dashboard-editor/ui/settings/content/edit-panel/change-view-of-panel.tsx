import { Button, Group, Modal, Radio, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBoxMultiple, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext } from '~/contexts';
import { PanelModelInstance } from '~/dashboard-editor/model/panels';

interface IChangeViewOfPanel {
  panel: PanelModelInstance;
  sourceViewID: string;
}
export const ChangeViewOfPanel = observer(({ panel, sourceViewID }: IChangeViewOfPanel) => {
  const { t } = useTranslation();
  const content = useEditContentModelContext();
  const [targetViewID, setTargetViewID] = useState(sourceViewID);
  useEffect(() => {
    setTargetViewID(sourceViewID);
  }, [sourceViewID]);
  const [opened, { open, close }] = useDisclosure(false);

  const confirm = () => {
    panel.moveToView(sourceViewID, targetViewID);
    close();
  };

  return (
    <>
      <Button size="xs" variant="subtle" color="blue" onClick={open} leftIcon={<IconBoxMultiple size={14} />}>
        {t('panel.settings.change_view')}
      </Button>
      <Modal opened={opened} onClose={close} title={t('panel.settings.change_view_title')} zIndex={320}>
        <Stack sx={{ maxHeight: 'calc(100vh - 185px)', overflow: 'hidden' }}>
          <Radio.Group
            value={targetViewID}
            onChange={setTargetViewID}
            pb={10}
            sx={{ flexGrow: 1, maxHeight: 'calc(100vh - 185px - 30px)', overflow: 'auto' }}
          >
            <Stack spacing="xs">
              {content.views.options.map((o) => (
                <Radio key={o.value} value={o.value} label={o.label} />
              ))}
            </Stack>
          </Radio.Group>

          <Group noWrap position="apart" sx={{ flexGrow: 0, flexShrink: 0 }}>
            <Button size="xs" color="red" leftIcon={<IconX size={14} />} onClick={close}>
              {t('common.actions.cancel')}
            </Button>
            <Button
              size="xs"
              color="blue"
              leftIcon={<IconDeviceFloppy size={14} />}
              onClick={confirm}
              disabled={targetViewID === sourceViewID}
            >
              {t('common.actions.confirm')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
});
