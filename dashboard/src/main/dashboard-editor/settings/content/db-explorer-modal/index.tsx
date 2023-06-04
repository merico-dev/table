import { Badge, Box, Button, Group, Modal, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { DataSourceModelInstance } from '~/model/datasources/datasource';
import { AnyObject } from '~/types';
import { DBExplorer } from './db-explorer';

const modalStyles = {
  modal: { paddingLeft: '0px !important', paddingRight: '0px !important' },
  header: { marginBottom: 0, padding: '0 20px 10px', borderBottom: '1px solid #efefef' },
  title: { flexGrow: 1 },
  body: {
    padding: '0 0 0 20px',
  },
};

interface IDBExplorerModal {
  dataSource: DataSourceModelInstance;
  triggerButtonProps?: AnyObject;
}

export const DBExplorerModal = observer(({ dataSource, triggerButtonProps = {} }: IDBExplorerModal) => {
  const [opened, setOpened] = useState(false);

  if (dataSource.type === 'http') {
    return null;
  }
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Group position="apart" sx={{ flexGrow: 1 }}>
            <Text fw={500}>Explorer Data Source</Text>
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
        styles={modalStyles}
      >
        <Box sx={{ height: 'calc(100vh - 220px)' }}>
          <DBExplorer dataSource={dataSource} />
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
