import { Select } from '@mantine/core';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { queryBySQL } from '../../api-caller';
import { FilterModelInstance } from '../../model';
import { IFilterConfig_Select } from '../../model/filters/filter/select';

interface IFilterSelect extends Omit<FilterModelInstance, 'key' | 'type' | 'config'> {
  config: IFilterConfig_Select;
  value: $TSFixMe;
  onChange: (v: $TSFixMe) => void;
}

export const FilterSelect = observer(({ label, config, value, onChange }: IFilterSelect) => {
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
    <Select
      label={label}
      data={usingRemoteOptions ? remoteOptions : config.static_options}
      disabled={usingRemoteOptions ? loading : false}
      value={value}
      onChange={onChange}
      styles={{
        input: {
          borderColor: '#e9ecef',
        },
      }}
    />
  );
});
