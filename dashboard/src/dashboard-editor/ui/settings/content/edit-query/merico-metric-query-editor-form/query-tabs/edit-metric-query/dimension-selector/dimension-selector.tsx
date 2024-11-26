import { Combobox, Group, Input, InputBase, Loader, Stack, Text, useCombobox } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';
import { DimensionCol, DimensionColDataType } from '~/dashboard-editor/model/datasources/mm-info';
import { DimensionIcon } from './dimension-icon/dimension-icon';
import { ComboBoxStyles, getInputStyles } from './styles';

const renderOption = (
  option: {
    label: string;
    value: string;
    description: string;
    dataType: DimensionColDataType;
  },
  isSubOption: boolean,
) => {
  return (
    <Combobox.Option key={option.value} value={option.value} className={isSubOption ? 'sub-option' : ''}>
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
  label?: string;
  type: DimensionCol['type'];
};
export const DimensionSelector = observer(({ queryModel, label, value, onChange, type }: DimensionSelectorProps) => {
  const ds = queryModel.datasource as DataSourceModelInstance;
  const mmInfo = ds.mericoMetricInfo;
  const metric = mmInfo.metricDetail;
  const loading = mmInfo.metrics.loading || metric.loading;
  const InputStyles = useMemo(() => getInputStyles(label), [label]);

  const options = useMemo(() => {
    return metric.colOptions(type);
  }, [metric.cols, type]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        onChange(val);
        combobox.closeDropdown();
      }}
      styles={ComboBoxStyles}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          variant="unstyled"
          size="xs"
          pointer
          leftSection={
            label ? (
              <Text size="sm" c="black">
                {label}
              </Text>
            ) : null
          }
          rightSection={loading ? <Loader size="xs" /> : null}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
          disabled={loading || options.length === 0}
          styles={InputStyles}
        >
          {value || <Input.Placeholder>选择维度</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

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
                      {item.items?.map((o) => renderOption(o, true))}
                    </Combobox.Group>
                  );
                }

                return renderOption(item, false);
              })}
            </Combobox.Group>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
});
