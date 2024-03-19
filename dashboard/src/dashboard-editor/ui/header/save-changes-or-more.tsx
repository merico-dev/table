import { ActionIcon, Button, Group, Menu, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { IconAlertTriangle, IconCaretDown, IconDeviceFloppy, IconRecycle } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext } from '~/contexts';

export interface ISaveChangesOrMore {
  saveDashboardChanges: () => void;
}

export const SaveChangesOrMore = observer(({ saveDashboardChanges }: ISaveChangesOrMore) => {
  const { t } = useTranslation();
  const modals = useModals();
  const model = useEditContentModelContext();

  const revertWithConfirmation = () => {
    modals.openConfirmModal({
      title: (
        <Group position="left">
          <IconAlertTriangle size={18} color="red" />
          <Text>You are reverting changes</Text>
        </Group>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => model.reset(),
      zIndex: 320,
      withCloseButton: false,
    });
  };

  const hasChanges = model.changed;
  return (
    <Group spacing={0}>
      <Button
        color="green"
        variant="filled"
        size="xs"
        leftIcon={<IconDeviceFloppy size={18} />}
        onClick={saveDashboardChanges}
        disabled={!hasChanges}
        sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      >
        {t('common.actions.save_changes')}
      </Button>

      <Menu
        width={200}
        trigger="hover"
        openDelay={100}
        closeDelay={400}
        withinPortal
        zIndex={320}
        disabled={!hasChanges}
      >
        <Menu.Target>
          <ActionIcon
            variant="default"
            disabled={!hasChanges}
            sx={{
              height: '30px',
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              svg: { fill: 'rgb(173, 181, 189)', stroke: 'none' },
            }}
          >
            <IconCaretDown size={18} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            icon={<IconRecycle size={14} color="red" />}
            disabled={!hasChanges}
            onClick={revertWithConfirmation}
          >
            {t('common.actions.revert_changes')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
});
