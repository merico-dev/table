import { IconBrandMysql, IconDatabase, IconNetwork, IconTopologyRing3 } from '@tabler/icons-react';
import { DataSourceType } from '../../api-caller/datasource.typed';
import { ActionIcon, Group, Text } from '@mantine/core';

const names = {
  http: 'HTTP',
  mysql: 'MySQL',
  postgresql: 'PostgreSQL',
  merico_metric_system: 'Merico Metric System',
};

const icons = {
  http: <IconNetwork />,
  mysql: <IconBrandMysql />,
  postgresql: <IconDatabase />,
  merico_metric_system: <IconTopologyRing3 />,
};

interface IProps {
  type: DataSourceType;
}

export function DataSourceIcon({ type }: IProps) {
  return (
    <Group>
      <ActionIcon variant="subtle" size="xs" sx={{ transform: 'none !important' }}>
        {icons[type]}
      </ActionIcon>
      <Text sx={{ cusor: 'default', userSelect: 'none' }}>{names[type]}</Text>
    </Group>
  );
}
