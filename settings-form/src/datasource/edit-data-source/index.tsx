import { Box, Button, Modal, Tooltip } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconEdit, IconLock } from '@tabler/icons-react';
import React from 'react';
import { APICaller } from '../../api-caller';
import { IDataSource } from '../../api-caller/datasource.typed';
import { IStyles, defaultStyles } from '../styles';
import { EditDataSourceForm_HTTP } from './forms/http';
import { IFormValues } from './types';
import { useTranslation } from 'react-i18next';

interface IEditDataSourceForm {
  dataSource: IDataSource;
  postSubmit: () => void;
  styles?: IStyles;
}

function EditDataSourceForm({ dataSource, postSubmit, styles = defaultStyles }: IEditDataSourceForm) {
  const { t } = useTranslation();
  const update = async ({ config }: IFormValues) => {
    showNotification({
      id: 'for-updating',
      title: t('settings.common.state.pending'),
      message: t('settings.datasource.state.updating'),
      loading: true,
      autoClose: false,
    });
    try {
      console.log({ config });
      await APICaller.datasource.update(dataSource.id, config);
      updateNotification({
        id: 'for-updating',
        title: t('settings.common.state.successful'),
        message: t('settings.datasource.state.updated'),
        color: 'green',
        autoClose: true,
      });
      postSubmit();
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-updating',
        title: t('settings.common.state.failed'),
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
  const { t } = useTranslation();
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
        label={t('settings.datasource.cant_edit.preset')}
      >
        <Button
          size={styles.button.size}
          color="gray"
          variant="light"
          leftIcon={<IconLock size={16} />}
          sx={{ transform: 'none !important' }}
        >
          {t('settings.common.actions.edit')}
        </Button>
      </Tooltip>
    );
  }

  if (dataSource.type !== 'http') {
    return (
      <Tooltip
        withArrow
        events={{ hover: true, touch: false, focus: false }}
        label={t('settings.datasource.cant_edit.db')}
      >
        <Button
          size={styles.button.size}
          color="gray"
          variant="light"
          leftIcon={<IconEdit size={16} />}
          sx={{ transform: 'none !important' }}
        >
          {t('settings.common.actions.edit')}
        </Button>
      </Tooltip>
    );
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={t('settings.datasource.edit')}
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <EditDataSourceForm dataSource={dataSource} postSubmit={postSubmit} styles={styles} />
      </Modal>
      <Button size={styles.button.size} color="blue" onClick={open} leftIcon={<IconEdit size={16} />}>
        {t('settings.common.actions.edit')}
      </Button>
    </>
  );
}
