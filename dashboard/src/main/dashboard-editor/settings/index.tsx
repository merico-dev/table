import { AppShell, Modal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { SettingsNavbar } from './navbar';

const SettingsAppShellStyles = {
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  body: {
    flexGrow: 1,
    nav: {
      top: 0,
      height: '100vh',
    },
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 0,
    height: '100vh',
  },
} as const;

export const Settings = observer(() => {
  const editor = useModelContext().editor;

  return (
    <Modal
      onClose={() => editor.setSettingsOpen(false)}
      closeOnEscape={false}
      closeOnClickOutside={false}
      opened={editor.settings_open}
      fullScreen
      title={null}
      transitionDuration={0}
      withCloseButton={false}
      withinPortal
      zIndex={400}
    >
      <AppShell padding={0} navbar={<SettingsNavbar />} styles={SettingsAppShellStyles}>
        {editor.path}
      </AppShell>
    </Modal>
  );
});
