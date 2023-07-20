import { Button, Modal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { QueryVariablesGuide } from './query-variables-guide';

export const QueryVariablesModal = observer(() => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Query Variables" zIndex={320} size="800px">
        <QueryVariablesGuide />
      </Modal>

      <Button
        variant="subtle"
        onClick={() => setOpened(true)}
        px={16}
        styles={{ inner: { justifyContent: 'flex-start' } }}
      >
        See Query Variables
      </Button>
    </>
  );
});
