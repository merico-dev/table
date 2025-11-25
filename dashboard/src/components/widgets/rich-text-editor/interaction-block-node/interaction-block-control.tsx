import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import { IconHandClick, IconHandOff } from '@tabler/icons-react';
import { Editor } from '@tiptap/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface InteractionBlockModalProps {
  opened: boolean;
  onClose: () => void;
  editor: Editor;
}

function InteractionBlockModal({ opened, onClose, editor }: InteractionBlockModalProps) {
  const { t } = useTranslation();
  const [blockId, setBlockId] = useState('');

  // Read blockId from the current selection when modal opens
  const getCurrentBlockId = () => {
    const { state } = editor;
    const { $from } = state.selection;

    // Check if the current selection is inside an interaction block
    for (let depth = $from.depth; depth > 0; depth--) {
      const node = $from.node(depth);
      if (node.type.name === 'interactionBlock') {
        return node.attrs.blockId || '';
      }
    }
    return '';
  };

  const handleSubmit = () => {
    if (blockId.trim()) {
      editor.chain().focus().toggleInteractionBlock(blockId.trim()).run();
      setBlockId('');
      onClose();
    }
  };

  const handleCancel = () => {
    setBlockId('');
    onClose();
  };

  // Read blockId when modal opens
  useEffect(() => {
    if (opened) {
      const currentBlockId = getCurrentBlockId();
      setBlockId(currentBlockId);
    }
  }, [opened]);

  return (
    <Modal
      opened={opened}
      zIndex={1200}
      onClose={handleCancel}
      title={t('rich_text_editor.interaction_block.modal_title')}
    >
      <Stack gap="md">
        <TextInput
          label={t('rich_text_editor.interaction_block.block_id_label')}
          description={t('rich_text_editor.interaction_block.block_id_description')}
          placeholder={t('rich_text_editor.interaction_block.block_id_placeholder')}
          value={blockId}
          onChange={(e) => setBlockId(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        <Group justify="flex-end" gap="sm">
          <Button variant="default" size="xs" onClick={handleCancel}>
            {t('common.actions.cancel')}
          </Button>
          <Button variant="filled" color="blue" size="xs" onClick={handleSubmit} disabled={!blockId.trim()}>
            {t('common.actions.apply')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export function InteractionBlockControl() {
  const { t } = useTranslation();
  const { editor } = useRichTextEditorContext();
  const [modalOpened, setModalOpened] = useState(false);

  function handleControlClick() {
    setModalOpened(true);
  }
  if (!editor) {
    return null;
  }

  const isActive = editor.isActive('interactionBlock');

  return (
    <>
      <RichTextEditor.Control
        onClick={handleControlClick}
        active={isActive}
        aria-label={t('rich_text_editor.interaction_block.toggle_tooltip')}
        title={t('rich_text_editor.interaction_block.toggle_tooltip')}
      >
        <IconHandClick stroke={1.5} size={16} />
      </RichTextEditor.Control>
      <InteractionBlockModal opened={modalOpened} onClose={() => setModalOpened(false)} editor={editor} />
    </>
  );
}

export function ClearInteractionBlockControl() {
  const { t } = useTranslation();
  const { editor } = useRichTextEditorContext();

  function handleClearClick() {
    editor?.commands.unsetInteractionBlock();
  }

  if (!editor) {
    return null;
  }

  const isActive = editor.isActive('interactionBlock');

  return (
    <RichTextEditor.Control
      onClick={handleClearClick}
      disabled={!isActive}
      aria-label={t('rich_text_editor.interaction_block.clear_tooltip')}
      title={t('rich_text_editor.interaction_block.clear_tooltip')}
    >
      <IconHandOff stroke={1.5} size={16} />
    </RichTextEditor.Control>
  );
}
