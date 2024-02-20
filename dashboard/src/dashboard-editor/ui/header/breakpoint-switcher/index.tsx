import { Button, Group, Menu, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDevices, IconSettings } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEditContentModelContext } from '~/contexts';
import { EditBreakpoints } from './edit-breakpoints';

export const BreakpointSwitcher = observer(() => {
  const [opened, { open, close }] = useDisclosure(false);
  const contentModel = useEditContentModelContext();
  const currentBreakpoint = contentModel.layouts.currentBreakpoint;
  const range = contentModel.layouts.currentLayoutRange;
  return (
    <>
      <Menu withArrow withinPortal zIndex={320} trigger="hover">
        <Menu.Target>
          <Button size="xs" variant="subtle" leftIcon={<IconDevices size={16} />} sx={{ borderRadius: 0 }}>
            <Group spacing={6}>
              <Text size="xs" fw="normal">
                {range.name}
              </Text>
              <Text size="xs" color="#777">
                {contentModel.layouts.currentRangeText}
              </Text>
            </Group>
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {contentModel.layouts.breakpointRanges.map((r) => (
            <Menu.Item
              key={r.id}
              onClick={() => contentModel.layouts.setCurrentBreakpoint(r.id)}
              disabled={currentBreakpoint === r.id}
            >
              <Group position="apart">
                <Text size="sm">{r.name}</Text>
                <Text size="xs" color="dimmed">
                  {r.text}
                </Text>
              </Group>
            </Menu.Item>
          ))}
          <Menu.Divider />
          <Menu.Item color="blue" icon={<IconSettings size={14} />} onClick={open}>
            <Text size="sm">Manage screen sizes</Text>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Modal
        opened={opened}
        onClose={close}
        title="Screen sizes"
        withinPortal
        zIndex={320}
        size={600}
        closeOnClickOutside={false}
      >
        <EditBreakpoints />
      </Modal>
    </>
  );
});
