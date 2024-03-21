import { Select, Stack, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { EViewComponentType, ViewMetaInstance } from '~/model';
import { ConfigFields } from './config-fields';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export const EditViewForm = observer(({ view }: { view?: ViewMetaInstance }) => {
  const { t, i18n } = useTranslation();
  const options = useMemo(() => {
    return [
      { label: t('view.component.div.label'), value: EViewComponentType.Division },
      { label: t('view.component.modal.label'), value: EViewComponentType.Modal },
      { label: t('view.component.tabs.label'), value: EViewComponentType.Tabs },
    ];
  }, [i18n.language]);

  if (!view) {
    return null;
  }
  return (
    <Stack sx={{ position: 'relative' }}>
      <TextInput
        label={t('common.name')}
        value={view.name}
        onChange={(e) => {
          view.setName(e.currentTarget.value);
        }}
      />
      <Select
        label={t('common.type')}
        withinPortal
        zIndex={320}
        value={view.type}
        onChange={view.setType}
        data={options}
      />
      <ConfigFields view={view} />
    </Stack>
  );
});
