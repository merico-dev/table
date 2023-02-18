import { Modal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';

export const Settings = observer(() => {
  const editor = useModelContext().editor;

  return (
    <Modal
      opened={editor.settings_open}
      onClose={() => editor.setSettingsOpen(false)}
      title="Introduce yourself!"
      closeOnEscape={false}
      closeOnClickOutside={false}
      fullScreen
      zIndex={400}
      transitionDuration={0}
    >
      {editor.path}
    </Modal>
  );
});
