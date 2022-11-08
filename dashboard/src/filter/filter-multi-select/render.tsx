import { MultiSelect } from '@mantine/core';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { queryBySQL } from '../../api-caller';
import { FilterModelInstance } from '../../model';
import { IFilterConfig_MultiSelect } from '../../model/filters/filter/multi-select';

interface IFilterMultiSelect extends Omit<FilterModelInstance, 'key' | 'type' | 'config'> {
  config: IFilterConfig_MultiSelect;
  value: $TSFixMe;
  onChange: (v: $TSFixMe) => void;
}

export const FilterMultiSelect = observer(({ label, config, value, onChange }: IFilterMultiSelect) => {
  const model = useModelContext();
  const usingRemoteOptions = !!config.options_query.sql;
  const { data: remoteOptions = [], loading } = useRequest(
    async () => {
      const payload = {
        context: model.context.current,
        mock_context: model.mock_context.current,
        sqlSnippets: model.sqlSnippets.current,
        title: label,
        query: config.options_query,
        filterValues: model.filters.values,
      };
      return queryBySQL(payload);
    },
    {
      // TODO: add entries of model.filters.values to refreshDeps, by usage
      refreshDeps: [
        config.options_query,
        usingRemoteOptions,
        model.context.current,
        model.mock_context.current,
        model.sqlSnippets.current,
      ],
    },
  );

  return (
    <MultiSelect
      label={label}
      data={usingRemoteOptions ? remoteOptions : config.static_options}
      disabled={usingRemoteOptions ? loading : false}
      value={value}
      onChange={onChange}
      sx={{ minWidth: '14em' }}
      styles={{
        input: {
          borderColor: '#e9ecef',
        },
      }}
    />
  );
});
