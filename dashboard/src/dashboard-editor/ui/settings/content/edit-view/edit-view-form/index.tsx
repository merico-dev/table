import { Select, Stack, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { EViewComponentType, ViewMetaInstance } from '~/model';
import { ConfigFields } from './config-fields';
import { useTranslation } from 'react-i18next';

export const viewComponentNames = {
  [EViewComponentType.Division]: 'Division',
  [EViewComponentType.Modal]: 'Modal',
  [EViewComponentType.Tabs]: 'Tabs',
};

const viewComponentTypeOptions = [
  { label: viewComponentNames[EViewComponentType.Division], value: EViewComponentType.Division },
  { label: viewComponentNames[EViewComponentType.Modal], value: EViewComponentType.Modal },
  { label: viewComponentNames[EViewComponentType.Tabs], value: EViewComponentType.Tabs },
];

export const EditViewForm = observer(({ view }: { view?: ViewMetaInstance }) => {
  const { t } = useTranslation();
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
        data={viewComponentTypeOptions}
      />
      <ConfigFields view={view} />
    </Stack>
  );
});
