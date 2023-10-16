import { Select, Stack, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { EViewComponentType, ViewMetaInstance } from '~/model';
import { ConfigFields } from './config-fields';

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
  if (!view) {
    return null;
  }
  return (
    <Stack sx={{ position: 'relative' }}>
      <TextInput
        label="Name"
        value={view.name}
        onChange={(e) => {
          view.setName(e.currentTarget.value);
        }}
      />
      <Select
        label="Type"
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
