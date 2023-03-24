import { Badge, Box, Button, Group, Modal, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { DataSourceModelInstance } from '~/model/datasources/datasource';
import { AnyObject } from '~/types';
import { TableStructure } from './table-structure';

interface ITableStructureModal {
  dataSource: DataSourceModelInstance;
  triggerButtonProps: AnyObject;
}

export const TableStructureModal = observer(({ dataSource, triggerButtonProps = {} }: ITableStructureModal) => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Group position="apart" sx={{ flexGrow: 1 }}>
            <Text fw={500}>Table Structure of Data Source</Text>
            <Group spacing={7}>
              <Badge variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
                {dataSource.key}
              </Badge>
              <Badge variant="gradient" gradient={{ from: 'orange', to: 'red' }}>
                {dataSource.type}
              </Badge>
            </Group>
          </Group>
        }
        zIndex={320}
        size="96vw"
        overflow="inside"
        styles={{ title: { flexGrow: 1 } }}
      >
        <Box sx={{ height: 'calc(100vh - 220px)' }}>
          <TableStructure dataSource={dataSource} />
        </Box>
      </Modal>

      <Button
        variant="subtle"
        onClick={() => setOpened(true)}
        px={16}
        styles={{ inner: { justifyContent: 'flex-start' } }}
        {...triggerButtonProps}
      >
        See Table Structure
      </Button>
    </>
  );
});
