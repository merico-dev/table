import { Button, Modal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { DataSourceModelInstance } from '~/model/datasources/datasource';

export const TableStructureModal = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Table Structure" zIndex={320} size="800px">
        TODO
      </Modal>

      <Button variant="subtle" onClick={() => setOpened(true)} styles={{ inner: { justifyContent: 'flex-start' } }}>
        See Table Structure
      </Button>
    </>
  );
});
