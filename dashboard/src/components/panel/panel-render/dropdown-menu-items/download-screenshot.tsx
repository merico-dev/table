import { Menu } from '@mantine/core';
import { IconCamera } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useRenderPanelContext } from '~/contexts';

export const DownloadScreenshot = observer(() => {
  const { t } = useTranslation();
  const { panel, downloadPanelScreenshot } = useRenderPanelContext();
  return (
    <Menu.Item onClick={downloadPanelScreenshot} leftSection={<IconCamera size={14} />}>
      {t('common.actions.download_screenshot')}
    </Menu.Item>
  );
});
