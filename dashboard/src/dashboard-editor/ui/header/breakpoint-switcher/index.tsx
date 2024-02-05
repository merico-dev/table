import { Button, Group, Menu, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDevices, IconSettings } from '@tabler/icons-react';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useEditContentModelContext } from '~/contexts';
import { ManageBreakpoints } from './manage-breakpoints';

export const BreakpointSwitcher = observer(() => {
  const [opened, { open, close }] = useDisclosure(false);
  const contentModel = useEditContentModelContext();
  const currentBreakpoint = contentModel.layouts.currentBreakpoint;
  const layoutSet = contentModel.layouts.currentLayoutSet;
  return (
    <>
      <Menu withArrow withinPortal zIndex={320} trigger="hover">
        <Menu.Target>
          <Button size="xs" variant="light" leftIcon={<IconDevices size={16} />}>
            <Group spacing={6}>
              <Text size="xs" fw="normal">
                {layoutSet.id}
              </Text>
              <Text size="xs" sx={{ opacity: 0.6 }}>
                (width ≥ {layoutSet.breakpoint}px)
              </Text>
            </Group>
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {contentModel.layouts.breakpointOptions.map((o) => (
            <Menu.Item
              key={o.label}
              onClick={() => contentModel.layouts.setCurrentBreakpoint(o.label)}
              disabled={currentBreakpoint === o.label}
            >
              <Group position="apart">
                <Text size="sm">{o.label}</Text>
                <Text size="xs" color="dimmed">
                  width ≥ {o.value}px
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

      <Modal opened={opened} onClose={close} title="Screen sizes" withinPortal zIndex={320} size={600}>
        <ManageBreakpoints />
      </Modal>
    </>
  );
});
