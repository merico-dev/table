import { ActionIcon, Group, Text } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

type Props = {
  canSubmit: boolean;
};

export function ChartConfigBanner({ canSubmit }: Props) {
  const { t } = useTranslation();
  return (
    <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
      <Text>{t('chart.chart_config')}</Text>
      <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!canSubmit}>
        <IconDeviceFloppy size={20} />
      </ActionIcon>
    </Group>
  );
}
