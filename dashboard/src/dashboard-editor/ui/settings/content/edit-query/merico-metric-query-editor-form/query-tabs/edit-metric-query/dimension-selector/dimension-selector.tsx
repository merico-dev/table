import {
  Combobox,
  ComboboxLikeRenderOptionInput,
  Group,
  Input,
  InputBase,
  Loader,
  Select,
  SelectProps,
  Stack,
  Text,
  useCombobox,
} from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { DimensionIcon } from './dimension-icon/dimension-icon';
import { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';
import { DimensionCol, DimensionColDataType } from '~/dashboard-editor/model/datasources/mm-info/metric-detail';

const ComboBoxStyles = {
  option: {
    fontFamily: 'monospace',
    '&.sub-option': {
      position: 'relative',
      marginLeft: '22px',
    },
    '&.sub-option::before': {
      content: '""',
      width: '1px',
      height: '100%',
      position: 'absolute',
      left: '-6px',
      borderLeft: '1px solid #E7E7E9',
    },
  },
  groupLabel: {
    cursor: 'default',
    fontWeight: 'normal',
    '&::before': {
      content: '""',
      flex: 1,
      insetInline: 0,
      height: 'calc(0.0625rem* var(--mantine-scale))',
      marginInlineEnd: 'var(--mantine-spacing-xs)',
      backgroundColor: 'var(--mantine-color-gray-2)',
    },
  },
  group: {
    '&.dimension-group': {
      paddingBottom: '4px',
      '.mantine-Combobox-groupLabel': {
        color: '#000',
      },
      '.mantine-Combobox-groupLabel::before': {
        display: 'none',
      },
      '.mantine-Combobox-groupLabel::after': {
        display: 'none',
      },
    },
  },
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
  const InputStyles = useMemo(
    () => ({
      root: {
        maxWidth: 'unset',
      },
      option: {
        fontFamily: 'monospace',
      },
      section: {
        '&[data-position="left"]': {
          width: label ? '70px' : '0px',
          justifyContent: 'flex-start',
        },
      },
      input: {
        paddingInlineStart: label ? '70px' : 'var(--input-padding-inline-start)',
        color: 'gray',
        fontFamily: 'monospace',
      },
    }),
    [label],
  );

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
