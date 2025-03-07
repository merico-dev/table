import { Group, Select, SelectProps } from '@mantine/core';
import { IconLayersIntersect, IconLayersOff, IconLayersSubtract } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FilterMultiSelectConfigInstance,
  FilterTreeSelectConfigInstance,
  FilterTreeSingleSelectConfigInstance,
} from '~/model';

const iconProps = {
  stroke: 1.5,
  color: 'currentColor',
  opacity: 1,
  size: 18,
};

const icons: Record<string, React.ReactNode> = {
  intersect: <IconLayersIntersect {...iconProps} />,
  reset: <IconLayersSubtract {...iconProps} />,
};

const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => (
  <Group flex="1" gap="xs">
    {icons[option.value]}
    {option.label}
  </Group>
);

type Props = {
  config: FilterMultiSelectConfigInstance | FilterTreeSelectConfigInstance | FilterTreeSingleSelectConfigInstance;
};

export const DefaultValueModeSelector = observer(({ config }: Props) => {
  const { t, i18n } = useTranslation();
  const options = useMemo(() => {
    return [
      { label: t('filter.widget.common.default_value_mode.intersect'), value: 'intersect' },
      { label: t('filter.widget.common.default_value_mode.reset'), value: 'reset' },
    ];
  }, [i18n.language]);
  const { default_value_mode } = config;
  return (
    <Select
      leftSection={icons[default_value_mode] ?? null}
      label={t('filter.widget.common.default_value_mode.label')}
      data={options}
      value={default_value_mode}
      onChange={config.setDefaultValueMode}
      renderOption={renderSelectOption}
    />
  );
});
