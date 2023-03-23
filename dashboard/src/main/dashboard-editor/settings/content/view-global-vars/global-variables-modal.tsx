import { Button, Modal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { GlobalVariablesGuide } from './global-variables-guide';

export const GlobalVariablesModal = observer(() => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Global Variables" zIndex={320} size="800px">
        <GlobalVariablesGuide />
      </Modal>

      <Button variant="subtle" onClick={() => setOpened(true)} styles={{ inner: { justifyContent: 'flex-start' } }}>
        See Global Variables
      </Button>
    </>
  );
});
