import { IconBrandMysql, IconDatabase, IconNetwork } from '@tabler/icons';
import { DataSourceType } from '../../api-caller/datasource.typed';
import { ActionIcon, Group, Text } from '@mantine/core';

const names = {
  http: 'HTTP',
  mysql: 'MySQL',
  postgresql: 'PostgreSQL',
};

const icons = {
  http: <IconNetwork />,
  mysql: <IconBrandMysql />,
  postgresql: <IconDatabase />,
};

interface IProps {
  type: DataSourceType;
}

export function DataSourceIcon({ type }: IProps) {
  return (
    <Group>
      <ActionIcon size="xs" sx={{ transform: 'none !important' }}>
        {icons[type]}
      </ActionIcon>
      <Text sx={{ cusor: 'default', userSelect: 'none' }}>{names[type]}</Text>
    </Group>
  );
}
