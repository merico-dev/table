import { Button, Modal, Sx, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFileImport } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEditDashboardContext } from '~/contexts';
import { EViewComponentType } from '~/model';
import { ImportWithSchemaForm } from './form';

const ButtonSx: Sx = {
  height: '30px',
  borderRight: 'none',
  borderTop: 'none',
  borderLeft: '1px solid #e9ecef',
  borderBottom: '1px solid #e9ecef',
};

export const ImportWithSchema = observer(() => {
  const [opened, { open, close }] = useDisclosure(false);

  const model = useEditDashboardContext();
  const cant = model.content.views.VIE?.type === EViewComponentType.Tabs;
  if (cant) {
    return (
      <Tooltip label="Please choose a tab first">
        <Button
          variant="outline"
          color="gray"
          radius={0}
          size="xs"
          leftIcon={<IconFileImport size={16} />}
          sx={{
            ...ButtonSx,
            transform: 'none !important',
          }}
        >
          Import
        </Button>
      </Tooltip>
    );
  }
  return (
    <>
      <Button
        variant="subtle"
        color="blue"
        radius={0}
        size="xs"
        disabled={cant || opened}
        onClick={open}
        leftIcon={<IconFileImport size={16} />}
        sx={{
          ...ButtonSx,
          background: 'rgb(231, 245, 255)',
        }}
      >
        Import
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title="Import content with schema json"
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
        withinPortal
        zIndex={320}
      >
        <ImportWithSchemaForm onSuccess={close} />
      </Modal>
    </>
  );
});
