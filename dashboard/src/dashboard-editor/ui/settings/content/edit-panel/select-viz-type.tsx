import { ActionIcon, Select } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceFloppy } from 'tabler-icons-react';
import { PluginContext } from '~/components/plugins';

type OptionType = { label: string; value: string; group: string };
function useVizSelectData() {
  const { t } = useTranslation();
  const { vizManager } = useContext(PluginContext);
  return useMemo(() => {
    const ret: OptionType[] = vizManager.availableVizList.map((it) => ({
      value: it.name,
      label: t(it.displayName ?? it.name),
      group: t(it.displayGroup ?? ''),
    }));
    return _.orderBy(ret, [(i) => i.group, (i) => i.label], ['asc', 'asc']);
  }, [vizManager]);
}

interface ISelectVizType {
  value: string;
  submit: (type: string) => void;
}

export const SelectVizType = observer(({ value, submit }: ISelectVizType) => {
  const { t } = useTranslation();
  const [type, setType] = useInputState(value);
  useEffect(() => {
    setType(value);
  }, [value]);

  const selectData = useVizSelectData();
  const changed = value !== type;
  return (
    <Select
      label={t('visualization.component')}
      value={type}
      searchable
      onChange={setType}
      data={selectData}
      rightSection={
        <ActionIcon variant="filled" color="green" disabled={!changed} onClick={() => submit(type)}>
          <DeviceFloppy size={20} />
        </ActionIcon>
      }
      maxDropdownHeight={600}
    />
  );
});
