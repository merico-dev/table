import { Button, Collapse, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronsDown, IconChevronsUp } from '@tabler/icons-react';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useRenderContentModelContext } from '~/contexts';
import { FilterMetaInstance, ViewMetaInstance } from '~/model';
import { Filter } from './filter';
import { SearchButton } from './search-button';
import { useUpdateFilterPreviewValues } from './use-update-filter-preview-values';

const FilterToggler = ({ opened, toggle }: { opened: boolean; toggle: () => void }) => {
  return (
    <Group position="right" ml={-4} mt={-4} mb={opened ? 4 : 0}>
      <Button
        size="xs"
        compact
        variant="subtle"
        color={opened ? 'gray' : 'blue'}
        leftIcon={opened ? <IconChevronsUp size={14} /> : <IconChevronsDown size={14} />}
        onClick={toggle}
      >
        {opened ? 'Hide Filters' : 'Show Filters'}
      </Button>
    </Group>
  );
};

export const Filters = observer(function _Filters({ view }: { view: ViewMetaInstance }) {
  const [opened, { toggle }] = useDisclosure(true);

  const content = useRenderContentModelContext();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: content.filters.values,
    // make sure the preview value is updated when filters are changed
    reValidateMode: 'onBlur',
  });
  const formValue = useWatch({ control });
  useEffect(() => {
    reset(content.filters.values);
  }, [content.filters.values, reset]);

  useUpdateFilterPreviewValues(formValue);

  const filters = content.filters.visibleInView(view.id);
  const allAutoSubmit = useMemo(() => filters.every((f) => f.should_auto_submit), [filters]);
  const requiredFilters = useMemo(() => filters.filter((f) => _.get(f, 'config.required', false)), [filters]);
  const searchButtonDisabled = useMemo(() => {
    if (requiredFilters.length === 0) {
      return false;
    }
    return requiredFilters.some((f) => !f.requiredAndPass(formValue[f.key]));
  }, [formValue, requiredFilters]);

  if (filters.length === 0) {
    return null;
  }

  const getChangeHandler =
    (filter: FilterMetaInstance, onChange: (v: any) => void) => (v: any, forceSubmit?: boolean) => {
      onChange(v);
      if (filter.should_auto_submit || forceSubmit) {
        content.filters.setValueByKey(filter.key, v);
      }
    };

  return (
    <form onSubmit={handleSubmit(content.filters.setValues)}>
      <FilterToggler opened={opened} toggle={toggle} />
      <Collapse in={opened}>
        <Group
          className="dashboard-filters"
          position="apart"
          noWrap
          sx={allAutoSubmit ? {} : { border: '1px solid #e9ecef', borderRadius: '4px', padding: '16px' }}
        >
          <Group align="flex-start">
            {filters.map((filter) => (
              <Controller
                key={filter.id}
                name={filter.key}
                control={control}
                render={({ field }) => (
                  <Filter filter={filter} value={field.value} onChange={getChangeHandler(filter, field.onChange)} />
                )}
              />
            ))}
          </Group>
          {!allAutoSubmit && (
            <Group sx={{ alignSelf: 'flex-end' }}>
              <SearchButton disabled={searchButtonDisabled} />
            </Group>
          )}
        </Group>
      </Collapse>
    </form>
  );
});
