import { Menu } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useRenderPanelContext } from '~/contexts';

export const DownloadData = observer(() => {
  const { t } = useTranslation();
  const { panel } = useRenderPanelContext();
  return (
    <Menu.Item onClick={panel.downloadData} leftSection={<IconDownload size={14} />}>
      {t('common.actions.download_data')}
    </Menu.Item>
  );
});
