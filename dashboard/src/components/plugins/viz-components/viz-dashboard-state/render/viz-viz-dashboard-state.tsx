import { Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useStorageData } from '~/components/plugins';
import { VizViewProps } from '~/types/plugin';
import { IVizDashboardStateConf } from '../type';
import { StateItems } from './state-items';

export const VizVizDashboardState = observer(({ context }: VizViewProps) => {
  const { value: conf } = useStorageData<IVizDashboardStateConf>(context.instanceData, 'config');
  const { width, height } = context.viewport;
  if (!conf) {
    return null;
  }

  return (
    <Group
      justify="flex-start"
      align="flex-start"
      wrap="wrap"
      px={0}
      py={0}
      gap="xs"
      w={width}
      mah={height}
      style={{ overflow: 'auto' }}
      data-enable-scrollbar
    >
      <StateItems conf={conf} />
    </Group>
  );
});
