import { Menu } from '@mantine/core';
import { IconCode } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useRenderPanelContext } from '~/contexts';

export const DownloadSchema = observer(() => {
  const { t } = useTranslation();
  const { panel } = useRenderPanelContext();
  return (
    <Menu.Item onClick={panel.downloadSchema} leftSection={<IconCode size={14} />}>
      {t('common.actions.download_schema')}
    </Menu.Item>
  );
});
