import { Button, Modal, Stack, Text } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { CustomRichTextEditor } from './custom-rich-text-editor';

type Props = {
  initialValue: string;
  onChange: (v: string) => void;
  label?: string;
};

export const RichTextEditorModal = ({ initialValue, onChange, label }: Props) => {
  const { t } = useTranslation();
  const [opened, { setTrue: open, setFalse: onClose }] = useBoolean(false);
  return (
    <>
      <Stack gap={4}>
        <Text size="sm" fw="bold">
          {t('chart.stats.template.above_chart')}
        </Text>
        <Button variant="light" size="xs" onClick={open} disabled={opened}>
          {t('common.actions.edit_rich_text')}
        </Button>
      </Stack>
      <Modal
        opened={opened}
        onClose={onClose}
        withinPortal
        zIndex={400}
        closeOnEscape={false}
        closeOnClickOutside={false}
        withCloseButton={false}
        size={800}
      >
        {opened && (
          <CustomRichTextEditor
            value={initialValue}
            onChange={onChange}
            label={label ?? ''}
            styles={{ root: { flexGrow: 1, minHeight: '400px' } }}
            onCancel={onClose}
            onSubmit={onClose}
          />
        )}
      </Modal>
    </>
  );
};
