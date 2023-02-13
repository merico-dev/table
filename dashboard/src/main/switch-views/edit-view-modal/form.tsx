import { Select, Stack, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { EViewComponentType } from '~/types';
import { ConfigFields } from './config-fields';

const viewComponentTypeOptions = [
  { label: 'Division', value: EViewComponentType.Division },
  { label: 'Modal', value: EViewComponentType.Modal },
  { label: 'Tabs', value: EViewComponentType.Tabs },
];

export const EditViewForm = observer(() => {
  const model = useModelContext();
  const VIE = model.views.VIE;
  if (!VIE) {
    return null;
  }
  return (
    <Stack sx={{ position: 'relative' }}>
      <TextInput
        label="Name"
        value={VIE.name}
        onChange={(e) => {
          VIE.setName(e.currentTarget.value);
        }}
      />
      <Select label="Type" withinPortal value={VIE.type} onChange={VIE.setType} data={viewComponentTypeOptions} />
      <ConfigFields />
    </Stack>
  );
});
