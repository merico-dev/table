import { ActionIcon, Group, Select } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { MericoIconExternalLink } from './merico-icons';
import { showNotification } from '@mantine/notifications';

type Props = {
  queryModel: QueryModelInstance;
};

export const SelectMetric = observer(({ queryModel }: Props) => {
  return (
    <Group justify="flex-end" gap={4} align="flex-end">
      <Select
        label="指标"
        data={[
          { value: 'react', label: 'React' },
          { value: 'ng', label: 'Angular' },
          { value: 'vue', label: 'Vue', disabled: true },
          { value: 'svelte', label: 'Svelte', disabled: true },
        ]}
        styles={{ root: { flexGrow: 1 } }}
      />
      <ActionIcon size="md" variant="subtle" mb={4} onClick={() => showNotification({ message: 'TODO', color: 'red' })}>
        <MericoIconExternalLink width={14} height={14} />
      </ActionIcon>
    </Group>
  );
});
