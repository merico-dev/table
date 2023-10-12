import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFileImport } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEditDashboardContext } from '~/contexts';
import { EViewComponentType } from '~/model';
import { ImportWithSchemaForm } from './form';

export const ImportWithSchema = observer(() => {
  const [opened, { open, close }] = useDisclosure(false);

  const model = useEditDashboardContext();
  const cant = model.content.views.VIE?.type === EViewComponentType.Tabs;
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
          height: '30px',
          borderLeft: 'none',
          borderTop: 'none',
          borderRight: '1px solid #e9ecef',
          borderBottom: '1px solid #e9ecef',
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
