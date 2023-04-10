import { ActionIcon, Button, Group, Header as MantineHeader, Text, Tooltip } from '@mantine/core';
import { useModals } from '@mantine/modals';
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCode,
  IconDeviceFloppy,
  IconDownload,
  IconPlaylistAdd,
  IconRecycle,
} from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModelContext } from '~/contexts';
import { ActionIconGroupStyle } from '~/styles/action-icon-group-style';
import { downloadJSON } from '~/utils/download';

interface IDashboardEditorHeader {
  saveDashboardChanges: () => void;
  headerSlot?: ReactNode;
}

export const DashboardEditorHeader = observer(({ saveDashboardChanges, headerSlot = null }: IDashboardEditorHeader) => {
  const navigate = useNavigate();
  const model = useModelContext();

  const downloadSchema = () => {
    const schema = JSON.stringify(model.json, null, 2);
    downloadJSON(model.name, schema);
  };

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
    <MantineHeader height={60} px="md" py={0} sx={{ zIndex: 299 }}>
      <Group position="apart" sx={{ height: 60, position: 'relative' }}>
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
        </Group>
        {headerSlot}
        <Group position="right">
          <Button
            variant="filled"
            size="xs"
            disabled={!model.views.VIE}
            onClick={() => model.addANewPanel(model.views.idOfVIE)}
            leftIcon={<IconPlaylistAdd size={20} />}
          >
            Add a Panel
          </Button>

          <Group spacing={0} sx={ActionIconGroupStyle}>
            <Tooltip label="Download Schema" withinPortal>
              <ActionIcon variant="default" size="md" onClick={downloadSchema}>
                <IconCode size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Download Data" withinPortal>
              <ActionIcon variant="default" size="md" onClick={model.queries.downloadAllData}>
                <IconDownload size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Group spacing={16}>
            <Tooltip label="Revert Changes" withinPortal>
              <ActionIcon variant="default" size="md" disabled={!hasChanges} onClick={revertWithConfirmation}>
                <IconRecycle size={20} color="red" />
              </ActionIcon>
            </Tooltip>
            <Button
              color="green"
              variant="filled"
              size="xs"
              leftIcon={<IconDeviceFloppy size={18} />}
              onClick={saveDashboardChanges}
              disabled={!hasChanges}
            >
              Save Changes
            </Button>
          </Group>
        </Group>
      </Group>
    </MantineHeader>
  );
});
