import { Box, Button, Modal, SegmentedControl } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconPlaylistAdd } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { APICaller } from '../../api-caller';
import { DataSourceType } from '../../api-caller/datasource.typed';
import { defaultStyles, IStyles } from '../styles';
import { DBPermissionTips } from './db-permission-tips';
import { AddDataSourceForm_DB } from './forms/database';
import { AddDataSourceForm_HTTP } from './forms/http';
import { IFormValues } from './types';

interface IAddDataSourceForm {
  postSubmit: () => void;
  styles?: IStyles;
}

function AddDataSourceForm({ postSubmit, styles = defaultStyles }: IAddDataSourceForm) {
  const { t } = useTranslation();
  const [type, setType] = useState<DataSourceType>('postgresql');
  const addDataSource = async ({ type, key, config }: IFormValues) => {
    showNotification({
      id: 'for-creating',
      title: t('common.state.pending'),
      message: t('datasource.state.adding'),
      loading: true,
      autoClose: false,
    });
    try {
      console.log({ type, key, config });
      await APICaller.datasource.create(type, key, config);
      updateNotification({
        id: 'for-creating',
        title: t('common.state.successful'),
        message: t('datasource.state.added'),
        color: 'green',
        autoClose: true,
      });
      postSubmit();
    } catch (error: $TSFixMe) {
      console.error(error);
      updateNotification({
        id: 'for-creating',
        title: t('common.state.failed'),
        message: error.message,
        color: 'red',
        autoClose: true,
      });
    }
  };

  const isDBType = type === 'postgresql' || type === 'mysql';
  const isHTTPType = type === 'http';
  return (
    <Box mx="auto">
      <SegmentedControl
        fullWidth
        mb={styles.spacing}
        size={styles.size}
        data={[
          { label: 'PostgreSQL', value: 'postgresql' },
          { label: 'MySQL', value: 'mysql' },
          { label: 'HTTP', value: 'http' },
        ]}
        value={type}
        onChange={(v: DataSourceType) => setType(v)}
      />
      {isDBType && <DBPermissionTips styles={styles} />}
      {isDBType && <AddDataSourceForm_DB submit={addDataSource} styles={styles} type={type} />}
      {isHTTPType && <AddDataSourceForm_HTTP submit={addDataSource} styles={styles} />}
    </Box>
  );
}

interface IAddDataSource {
  styles?: IStyles;
  onSuccess: () => void;
}

export function AddDataSource({ onSuccess, styles = defaultStyles }: IAddDataSource) {
  const { t } = useTranslation();
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const postSubmit = () => {
    onSuccess();
    close();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={t('datasource.add')}
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <AddDataSourceForm postSubmit={postSubmit} styles={styles} />
      </Modal>
      <Button size={styles.button.size} onClick={open} leftSection={<IconPlaylistAdd size={20} />}>
        {t('datasource.add')}
      </Button>
    </>
  );
}
