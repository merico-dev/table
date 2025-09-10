import { Center, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useLayoutStateContext } from '~/contexts';
import { VizViewProps } from '~/types/plugin';

export function VizMericoPanelGroups({ context }: VizViewProps) {
  const { t } = useTranslation();
  const { inEditMode } = useLayoutStateContext();
  if (!inEditMode) {
    return null;
  }

  const { width, height } = context.viewport;
  return (
    <Center w={width} h={height} title={t('viz.merico_panel_groups.render')}>
      <Text c="dimmed" size="xs">
        {t('viz.merico_panel_groups.render')}
      </Text>
    </Center>
  );
}
