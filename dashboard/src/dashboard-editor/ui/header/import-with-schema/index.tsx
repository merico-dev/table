import { Button, Modal, Tooltip } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { useDisclosure } from '@mantine/hooks';
import { IconFileImport } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext } from '~/contexts';
import { EViewComponentType } from '~/model';
import { ImportWithSchemaForm } from './form';

const ButtonSx: EmotionSx = {
  height: '30px',
  borderLeft: 'none',
  borderTop: 'none',
  borderRight: '1px solid #e9ecef',
  borderBottom: '1px solid #e9ecef',
};

export const ImportWithSchema = observer(() => {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const [bigModal, { setTrue, setFalse }] = useBoolean(false);

  const model = useEditDashboardContext();
  const cant = model.content.views.VIE?.type === EViewComponentType.Tabs;
  if (cant) {
    return (
      <Tooltip label={t('common.choose_a_tab_first')}>
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
          {t('import.label')}
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
          // background: 'rgb(231, 245, 255)',
        }}
      >
        {t('import.label')}
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title={t('import.title')}
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
        withinPortal
        zIndex={320}
        size={bigModal ? '90vw' : 500}
      >
        <ImportWithSchemaForm onSuccess={close} stretchModal={setTrue} shrinkModal={setFalse} />
      </Modal>
    </>
  );
});
