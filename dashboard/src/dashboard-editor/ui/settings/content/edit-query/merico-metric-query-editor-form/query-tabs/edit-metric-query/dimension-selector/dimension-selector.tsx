import {
  CloseButton,
  Combobox,
  Group,
  Input,
  InputBase,
  Loader,
  Stack,
  Text,
  Tooltip,
  useCombobox,
} from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';
import { DimensionCol, DimensionColDataType } from '~/dashboard-editor/model/datasources/mm-info';
import { MericoMetricQueryMetaInstance } from '~/model';
import { DimensionIcon } from './dimension-icon/dimension-icon';
import { ComboBoxStyles, InputStyles } from './styles';
import { useMemo } from 'react';

const renderOption = (
  option: {
    label: string;
    value: string;
    description: string;
    dataType: DimensionColDataType | null;
  },
  isSubOption: boolean,
  disabled: boolean,
) => {
  const classNames = [];
  if (isSubOption) {
    classNames.push('sub-option');
  }
  if (disabled) {
    classNames.push('disabled');
  }
  return (
    <Combobox.Option key={option.value} value={option.value} className={classNames.join(' ')} disabled={disabled}>
      <Stack gap={1}>
        <Group gap={4}>
          <DimensionIcon type={option.dataType} />
          <Text size="xs">{option.label}</Text>
        </Group>
        <Text size="xs" c="dimmed" pl={18}>
          {option.description}
        </Text>
      </Stack>
    </Combobox.Option>
  );
};

type DimensionSelectorProps = {
  queryModel: QueryModelInstance;
  value: string | null;
  onChange: (v: string | null) => void;
  type: DimensionCol['type'];
};
export const DimensionSelector = observer(({ queryModel, value, onChange, type }: DimensionSelectorProps) => {
  const config = queryModel.config as MericoMetricQueryMetaInstance;
  const ds = queryModel.datasource as DataSourceModelInstance;
  const mmInfo = ds.mericoMetricInfo;
  const metric = mmInfo.metricDetail;

  const loading = mmInfo.metrics.loading || metric.loading;
  const error = metric.error;
  const selectedDimensionSet = config.selectedDimensionSet;
  const options = metric.colOptions(type);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const rightSection = useMemo(() => {
    if (loading) {
      return <Loader size="xs" />;
    }
    if (!!value) {
      return <CloseButton size="xs" onClick={() => onChange(null)} />;
    }
    return <Combobox.Chevron size="xs" />;
  }, [loading, value]);

  const Trigger = (
    <InputBase
      component="button"
      type="button"
      variant="unstyled"
      size="xs"
      pointer
      rightSection={rightSection}
      rightSectionPointerEvents={!loading && !!value ? 'all' : 'none'}
      onClick={() => combobox.toggleDropdown()}
      disabled={loading || options.length === 0}
      styles={InputStyles}
      error={!!error}
    >
      {value || <Input.Placeholder>选择维度</Input.Placeholder>}
    </InputBase>
  );

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        onChange(val);
        combobox.closeDropdown();
      }}
      styles={ComboBoxStyles}
    >
      <Combobox.Target>{error ? <Tooltip label={error}>{Trigger}</Tooltip> : Trigger}</Combobox.Target>

      <Combobox.Dropdown miw={300}>
        <Combobox.Options>
          {options.map(({ group, items }) => (
            <Combobox.Group key={group} label={group}>
              {items.map((item) => {
                if ('group' in item) {
                  return (
                    <Combobox.Group
                      key={item.group}
                      className="dimension-group"
                      label={
                        <Group gap={4}>
                          <DimensionIcon type="dimension" />
                          <Text size="sm">{item.group}</Text>
                          <Text size="xs" c="dimmed">
                            {item.description}
                          </Text>
                        </Group>
                      }
                    >
                      {item.items?.map((o) => renderOption(o, true, selectedDimensionSet.has(o.value)))}
                    </Combobox.Group>
                  );
                }

                return renderOption(item, false, selectedDimensionSet.has(item.value));
              })}
            </Combobox.Group>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
});
