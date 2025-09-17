import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { MMInfoModelInstance } from '~/dashboard-editor/model/datasources/mm-info';
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
import { ComboBoxStyles, InputStyles } from '../dimension-selector/styles';

export interface ISqlVarSelectorProps {
  mmInfo: MMInfoModelInstance;
  value: string | null;
  onChange: (v: string | null) => void;
  usedSqlVariables: Set<string>;
}

export const SqlVarSelector = observer(function SqlVarSelector_({
  mmInfo,
  value,
  onChange,
  usedSqlVariables,
}: ISqlVarSelectorProps) {
  const metric = mmInfo.metricDetail;

  const loading = mmInfo.metrics.loading || metric.loading;
  const error = metric.error;

  const options = useMemo(() => (metric.variables ?? []).map((v) => ({ label: v, value: v })), [metric.variables]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const rightSection = useMemo(() => {
    if (loading) return <Loader size="xs" />;
    if (!!value) return <CloseButton size="xs" onClick={() => onChange(null)} />;
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
      {value || <Input.Placeholder>选择变量</Input.Placeholder>}
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
        <Combobox.Options mah={500} style={{ overflowY: 'auto' }}>
          {options.map((o) => (
            <Combobox.Option key={o.value} value={o.value} disabled={usedSqlVariables.has(o.value)}>
              <Stack gap={1}>
                <Group gap={4}>
                  <Text size="xs">{o.label}</Text>
                </Group>
              </Stack>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
});
