import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconInfoCircle } from '@tabler/icons';
import { ReadonlyRichText } from '~/components/rich-text-editor/readonly-rich-text-editor';
import { FunctionUtilsDescription } from '~/utils/function-utils';

export function AboutFunctionUtils() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="About FunctionUtils" zIndex={320}>
        <ReadonlyRichText
          value={FunctionUtilsDescription}
          styles={{ root: { border: 'none' }, content: { padding: 0, table: { marginBottom: 0 } } }}
        />
      </Modal>

      <Button variant="light" color="violet" size="xs" onClick={open} leftIcon={<IconInfoCircle size={16} />}>
        About parameter 'utils'
      </Button>
    </>
  );
}
