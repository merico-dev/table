import { Divider, Select, Stack, Switch } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EViewComponentType, ViewMetaInstance, ViewTabsConfigInstance } from '~/model';

export const ViewTabsConfigFields = observer(({ view }: { view: ViewMetaInstance }) => {
  const { t, i18n } = useTranslation();

  const tabVariantOptions = useMemo(() => {
    return [
      {
        value: 'default',
        label: t('common.tabs.variant.default'),
      },
      {
        value: 'outline',
        label: t('common.tabs.variant.outline'),
      },
      {
        value: 'pills',
        label: t('common.tabs.variant.pills'),
      },
    ];
  }, [i18n.language]);

  const tabOrientationOptions = useMemo(() => {
    return [
      {
        value: 'horizontal',
        label: t('common.tabs.orientation.horizontal'),
      },
      {
        value: 'vertical',
        label: t('common.tabs.orientation.vertical'),
      },
    ];
  }, [i18n.language]);

  if (!view || view.type !== EViewComponentType.Tabs) {
    return null;
  }
  const config = view.config as ViewTabsConfigInstance;
  return (
    <Stack>
      <Divider mt={8} mb={0} label={t('view.component.tabs.tabs_settings')} labelPosition="center" />
      <Select
        label={t('common.tabs.variant.label')}
        value={config.variant}
        onChange={config.setVariant}
        data={tabVariantOptions}
      />
      <Select
        label={t('common.tabs.orientation.label')}
        value={config.orientation}
        onChange={config.setOrientation}
        data={tabOrientationOptions}
      />
      <Switch
        label={t('common.tabs.grow_tabs')}
        checked={config.grow}
        onChange={(e) => config.setGrow(e.currentTarget.checked)}
      />
    </Stack>
  );
});
