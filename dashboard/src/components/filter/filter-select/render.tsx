import { Select } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useRenderContentModelContext } from '~/contexts';
import { FilterMetaInstance, FilterSelectConfigInstance } from '~/model';
import { ErrorMessageOrNotFound } from '../error-message-or-not-found';
import { FilterSelectItem } from '../select-item';

interface IFilterSelect extends Omit<FilterMetaInstance, 'key' | 'type' | 'config'> {
  config: FilterSelectConfigInstance;
  value: string;
  onChange: (v: string, forceSubmit?: boolean) => void;
}

export const FilterSelect = observer(({ label, config, value, onChange }: IFilterSelect) => {
  const model = useRenderContentModelContext();
  const usingRemoteOptions = !!config.options_query_id;
  const { state, error } = model.getDataStuffByID(config.options_query_id);
  const loading = state === 'loading';

  return (
    <Select
      label={label}
      data={config.options}
      disabled={usingRemoteOptions ? loading : false}
      value={value}
      onChange={onChange}
      // error={!!error}
      maxDropdownHeight={500}
      styles={{
        root: {
          width: config.width ? config.width : '200px',
        },
        input: {
          borderColor: '#e9ecef',
        },
      }}
      sx={{
        '.mantine-Select-item[data-selected] .mantine-Text-root[data-role=description]': {
          color: 'rgba(255,255,255,.7)',
        },
        '.mantine-Select-nothingFound': {
          fontSize: '0.75rem',
          textAlign: 'left',
          padding: '4px 10px',
        },
      }}
      itemComponent={FilterSelectItem}
      searchable={!error}
      nothingFound={<ErrorMessageOrNotFound errorMessage={error} />}
      clearable={config.clearable}
    />
  );
});
