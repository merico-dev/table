import { Box, Button, Modal, Tooltip } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconEdit, IconLock } from '@tabler/icons-react';
import React from 'react';
import { APICaller } from '../../api-caller';
import { IDataSource } from '../../api-caller/datasource.typed';
import { IStyles, defaultStyles } from '../styles';
import { EditDataSourceForm_HTTP } from './forms/http';
import { IFormValues } from './types';

interface IEditDataSourceForm {
  dataSource: IDataSource;
  postSubmit: () => void;
  styles?: IStyles;
}

function EditDataSourceForm({ dataSource, postSubmit, styles = defaultStyles }: IEditDataSourceForm) {
  const update = async ({ config }: IFormValues) => {
    showNotification({
      id: 'for-updating',
      title: 'Pending',
      message: 'Editing data source...',
      loading: true,
      autoClose: false,
    });
    try {
      console.log({ config });
      await APICaller.datasource.update(dataSource.id, config);
      updateNotification({
        id: 'for-updating',
        title: 'Successful',
        message: 'Data source is updated',
        color: 'green',
        autoClose: true,
      });
      postSubmit();
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-updating',
        title: 'Failed',
        message: error.message,
        color: 'red',
        autoClose: true,
      });
    }
  };
  if (!dataSource.config) {
    console.error(new Error('unexpected empty config of a http datasource'));
    return null;
  }

  return (
    <Box mx="auto">
      <EditDataSourceForm_HTTP name={dataSource.key} config={dataSource.config} submit={update} styles={styles} />
    </Box>
  );
}

interface IEditDataSource {
  dataSource: IDataSource;
  styles?: IStyles;
  onSuccess: () => void;
}

export function EditDataSource({ dataSource, onSuccess, styles = defaultStyles }: IEditDataSource) {
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const postSubmit = () => {
    onSuccess();
    close();
  };

  if (dataSource.is_preset) {
    return (
      <Tooltip
        withArrow
        events={{ hover: true, touch: false, focus: false }}
        label="This is a preset datasource, it can not be changed"
      >
        <Button
          size={styles.button.size}
          color="gray"
          variant="light"
          leftIcon={<IconLock size={16} />}
          sx={{ transform: 'none !important' }}
        >
          Edit
        </Button>
      </Tooltip>
    );
  }

  if (dataSource.type !== 'http') {
    return (
      <Tooltip
        withArrow
        events={{ hover: true, touch: false, focus: false }}
        label="Only HTTP datasources can be edited"
      >
        <Button
          size={styles.button.size}
          color="gray"
          variant="light"
          leftIcon={<IconEdit size={16} />}
          sx={{ transform: 'none !important' }}
        >
          Edit
        </Button>
      </Tooltip>
    );
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add a data source"
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <EditDataSourceForm dataSource={dataSource} postSubmit={postSubmit} styles={styles} />
      </Modal>
      <Button size={styles.button.size} color="blue" onClick={open} leftIcon={<IconEdit size={16} />}>
        Edit
      </Button>
    </>
  );
}
