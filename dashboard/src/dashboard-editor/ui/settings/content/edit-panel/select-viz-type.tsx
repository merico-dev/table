import { ActionIcon, ComboboxItemGroup, Select } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { IconDeviceFloppy } from '@tabler/icons-react';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { PluginContext } from '~/components/plugins';

function useVizSelectData() {
  const { t } = useTranslation();
  const { vizManager } = useContext(PluginContext);
  return useMemo(() => {
    const grouped = _.orderBy(
      Object.entries(_.groupBy(vizManager.availableVizList, 'displayGroup')),
      [(i) => i[0]],
      ['asc'],
    );
    const ret: ComboboxItemGroup[] = grouped.map(([group, vizList]) => {
      const items = vizList.map((item) => {
        return {
          value: item.name,
          label: t(item.displayName ?? it.name),
        };
      });
      return {
        group: t(group ?? 'ungrouped'),
        items: _.orderBy(items, [(i) => i.label], ['asc']),
      };
    });

    return ret;
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
          <IconDeviceFloppy size={20} />
        </ActionIcon>
      }
      maxDropdownHeight={600}
    />
  );
});
