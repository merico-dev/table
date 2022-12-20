import { Button, Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { FilterModelInstance, ViewModelInstance } from '..';
import { useModelContext } from '../contexts/model-context';
import { Filter } from './filter';

export const Filters = observer(function _Filters({ view }: { view: ViewModelInstance }) {
  const model = useModelContext();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: model.filters.values,
    // make sure the preview value is updated when filters are changed
    reValidateMode: 'onBlur',
  });
  const formValue = useWatch({ control });
  useEffect(() => {
    reset(model.filters.values);
  }, [model.filters.values, reset]);
  useEffect(() => {
    // this form is not a controlled component,
    // so we need to manually update the model
    model.filters.updatePreviewValues(formValue);
  }, [formValue]);

  const filters = model.filters.visibleInView(view.id);
  const allAutoSubmit = useMemo(() => filters.every((f) => f.auto_submit), [filters]);

  if (filters.length === 0) {
    return null;
  }

  const getChangeHandler = (filter: FilterModelInstance, onChange: (v: any) => void) => (v: any) => {
    onChange(v);
    if (filter.auto_submit) {
      model.filters.setValueByKey(filter.key, v);
    }
  };

  return (
    <form onSubmit={handleSubmit(model.filters.setValues)}>
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
            <Button color="blue" size="sm" type="submit">
              Search
            </Button>
          </Group>
        )}
      </Group>
    </form>
  );
});
