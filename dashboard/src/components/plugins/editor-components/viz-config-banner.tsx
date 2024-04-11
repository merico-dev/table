import { ActionIcon, Group, Text } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

type Props = {
  canSubmit: boolean;
};

export function VizConfigBanner({ canSubmit }: Props) {
  const { t } = useTranslation();
  return (
    <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
      <Text>{t('viz.viz_config_banner')}</Text>
      <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!canSubmit}>
        <IconDeviceFloppy size={20} />
      </ActionIcon>
    </Group>
  );
}
