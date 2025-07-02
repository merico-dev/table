import { Button, HoverCard, Text } from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '~/utils';
import { DataKeySelector } from '../data-key-selector';
import { useDataKey } from '../../use-data-key';

type Props = {
  xDataKey: ReturnType<typeof useDataKey>;
  yDataKey: ReturnType<typeof useDataKey>;
  groupKey: ReturnType<typeof useDataKey>;
};
export const ChooseDataKeys = ({ xDataKey, yDataKey, groupKey }: Props) => {
  const { t } = useTranslation();
  return (
    <HoverCard shadow="md" withinPortal zIndex={320}>
      <HoverCard.Target>
        <Button variant="subtle" size="compact-xs" leftSection={<IconAdjustments size={14} />}>
          {t('viz.regression_chart.customize')}
        </Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <ErrorBoundary>
          <DataKeySelector
            variant="unstyled"
            size="xs"
            onChange={xDataKey.set}
            value={xDataKey.value}
            leftSection={<Text size="xs">{t('chart.x_axis.label')}</Text>}
            rightSectionWidth={14}
            w="auto"
            miw="unset"
          />
          <DataKeySelector
            variant="unstyled"
            size="xs"
            onChange={yDataKey.set}
            value={yDataKey.value}
            leftSection={<Text size="xs">{t('chart.y_axis.label')}</Text>}
            rightSectionWidth={14}
            w="auto"
            miw="unset"
          />
          <DataKeySelector
            variant="unstyled"
            size="xs"
            onChange={groupKey.set}
            value={groupKey.value}
            leftSection={<Text size="xs">{t('viz.regression_chart.split_by')}</Text>}
            rightSectionWidth={14}
            w="auto"
            miw="unset"
            clearable
          />
        </ErrorBoundary>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
