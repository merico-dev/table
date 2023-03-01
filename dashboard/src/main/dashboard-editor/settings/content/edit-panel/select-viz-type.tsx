import { ActionIcon, Select } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useMemo } from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { PluginContext } from '~/plugins';

const types: { label: string; value: string }[] = [];
function useVizSelectData() {
  const { vizManager } = useContext(PluginContext);
  return useMemo(
    () =>
      vizManager.availableVizList
        .map((it) => ({
          value: it.name,
          label: it.displayName,
        }))
        .concat(types),
    [vizManager],
  );
}

interface ISelectVizType {
  value: string;
  submit: (type: string) => void;
}

export const SelectVizType = observer(({ value, submit }: ISelectVizType) => {
  const [type, setType] = useInputState(value);
  useEffect(() => {
    setType(value);
  }, [value]);

  const selectData = useVizSelectData();
  const changed = value !== type;
  return (
    <Select
      label="Visualization"
      value={type}
      onChange={setType}
      data={selectData}
      rightSection={
        <ActionIcon disabled={!changed} onClick={() => submit(type)}>
          <DeviceFloppy size={20} />
        </ActionIcon>
      }
    />
  );
});
