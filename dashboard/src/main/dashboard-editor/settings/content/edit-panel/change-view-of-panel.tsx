import { Button, Group, Modal, Radio, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBoxMultiple, IconDeviceFloppy, IconX } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useModelContext } from '~/contexts';
import { PanelModelInstance } from '~/model/views/view/panels';

export const ChangeViewOfPanel = observer(({ panel }: { panel: PanelModelInstance }) => {
  const model = useModelContext();
  const [viewID, setViewID] = useState(panel.viewID);
  useEffect(() => {
    setViewID(panel.viewID);
  }, [panel.viewID]);
  const [opened, { open, close }] = useDisclosure(false);

  const confirm = () => {
    panel.moveToView(viewID);
    close();
  };

  return (
    <>
      <Button size="xs" variant="subtle" color="blue" onClick={open} leftIcon={<IconBoxMultiple size={14} />}>
        Move into Another View
      </Button>
      <Modal opened={opened} onClose={close} title="Move panel into another view" zIndex={320} overflow="inside">
        <Stack sx={{ maxHeight: 'calc(100vh - 185px)', overflow: 'hidden' }}>
          <Radio.Group
            value={viewID}
            onChange={setViewID}
            pb={10}
            sx={{ flexGrow: 1, maxHeight: 'calc(100vh - 185px - 30px)', overflow: 'auto' }}
          >
            <Stack spacing="xs">
              {model.views.options.map((o) => (
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
              disabled={viewID === panel.viewID}
            >
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
});
