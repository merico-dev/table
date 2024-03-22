import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconInfoCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ReadonlyRichText } from '~/components/widgets/rich-text-editor/readonly-rich-text-editor';
import { getFunctionUtilsDescription } from '~/utils';

export function AboutFunctionUtils() {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title={t('function_utils.modal_title')} zIndex={330} withinPortal>
        <ReadonlyRichText
          value={getFunctionUtilsDescription(t)}
          styles={{ root: { border: 'none' }, content: { padding: 0, table: { marginBottom: 0 } } }}
        />
      </Modal>

      <Button variant="light" color="violet" size="xs" onClick={open} leftIcon={<IconInfoCircle size={16} />}>
        {t('function_utils.trigger_text')}
      </Button>
    </>
  );
}
