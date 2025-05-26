import { Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useStorageData } from '~/components/plugins';
import { VizViewProps } from '~/types/plugin';
import { IVizDashboardStateConf } from '../type';
import { StateItems } from './state-items';

export const VizVizDashboardState = observer(({ context }: VizViewProps) => {
  const { value: conf } = useStorageData<IVizDashboardStateConf>(context.instanceData, 'config');
  if (!conf) {
    return null;
  }

  return (
    <Group justify="xs">
      <StateItems conf={conf} />
    </Group>
  );
});
