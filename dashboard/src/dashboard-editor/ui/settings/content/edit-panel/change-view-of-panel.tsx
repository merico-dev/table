import { Button, Group, Modal, Radio, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBoxMultiple, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useEditContentModelContext } from '~/contexts';
import { PanelModelInstance } from '~/dashboard-editor/model/panels';

interface IChangeViewOfPanel {
  panel: PanelModelInstance;
  sourceViewID: string;
}
export const ChangeViewOfPanel = observer(({ panel, sourceViewID }: IChangeViewOfPanel) => {
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
        Move into Another View
      </Button>
      <Modal opened={opened} onClose={close} title="Move panel into another view" zIndex={320}>
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
              Cancel
            </Button>
            <Button
              size="xs"
              color="blue"
              leftIcon={<IconDeviceFloppy size={14} />}
              onClick={confirm}
              disabled={targetViewID === sourceViewID}
            >
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
});
