import { Button, Group, Header as MantineHeader, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { IconAlertTriangle, IconArrowLeft } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModelContext } from '~/contexts';
import { HeaderMenu } from './header-menu';
import { ISaveChangesOrMore, SaveChangesOrMore } from './save-changes-or-more';

export interface IDashbaordEditorHeaderMain extends ISaveChangesOrMore {
  headerSlot?: ReactNode;
  headerMenuItems?: ReactNode;
}

export const MainHeader = observer(
  ({ saveDashboardChanges, headerSlot = null, headerMenuItems }: IDashbaordEditorHeaderMain) => {
    const navigate = useNavigate();
    const model = useModelContext();

    const goBack = () => {
      navigate(`/dashboard/${model.id}`);
    };
    const modals = useModals();

    const goBackWithConfirmation = () => {
      modals.openConfirmModal({
        title: (
          <Group position="left">
            <IconAlertTriangle size={18} color="red" />
            <Text>There are unsaved changes</Text>
          </Group>
        ),
        labels: { confirm: 'Discard', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onCancel: () => console.log('Cancel'),
        onConfirm: goBack,
        zIndex: 320,
        withCloseButton: false,
      });
    };

    const hasChanges = model.content.changed;

    return (
      <MantineHeader height={60} px="md" py={0} sx={{ zIndex: 299 }}>
        <Group position="apart" sx={{ height: 60, minWidth: '1000px', position: 'relative' }}>
          <Group>
            <Button
              size="xs"
              color={hasChanges ? 'red' : 'green'}
              leftIcon={<IconArrowLeft size={20} />}
              onClick={hasChanges ? goBackWithConfirmation : goBack}
            >
              <Group spacing={4}>
                End Editing
                <Text td="underline">{model.name}</Text>
              </Group>
            </Button>

            <SaveChangesOrMore saveDashboardChanges={saveDashboardChanges} />
          </Group>
          <Group position="right" sx={{ flexGrow: 1 }}>
            {headerSlot}
            <HeaderMenu headerMenuItems={headerMenuItems} />
          </Group>
        </Group>
      </MantineHeader>
    );
  },
);
