import { Badge, Button, Group, Modal, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { DataSourceModelInstance } from '~/model/datasources/datasource';

export const TableStructureModal = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Group spacing={6}>
            Table Structure of Data Source <Text fw={700}>{dataSource.key}</Text> <Badge>{dataSource.type}</Badge>
          </Group>
        }
        zIndex={320}
        size="96vw"
      >
        TODO
      </Modal>

      <Button
        variant="subtle"
        onClick={() => setOpened(true)}
        px={16}
        styles={{ inner: { justifyContent: 'flex-start' } }}
      >
        See Table Structure
      </Button>
    </>
  );
});
