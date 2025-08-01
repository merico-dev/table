import { Menu } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useRenderPanelContext } from '~/contexts';

export const Refresh = observer(() => {
  const { t } = useTranslation();
  const { panel } = useRenderPanelContext();
  return (
    <Menu.Item onClick={panel.refreshData} leftSection={<IconRefresh size={14} />}>
      {t('common.actions.refresh')}
    </Menu.Item>
  );
});
