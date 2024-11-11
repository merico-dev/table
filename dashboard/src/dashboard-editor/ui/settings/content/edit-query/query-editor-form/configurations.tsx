import { ActionIcon, Center, Divider, MultiSelect, Stack, TextInput } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomSelectorItem } from '~/components/widgets/custom-selector-item';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { DeleteQuery } from './delete-query';
import { SelectDataSource } from './select-data-source';

interface IQueryConfigurations {
  queryModel: QueryModelInstance;
}

export const QueryConfigurations = observer(({ queryModel }: IQueryConfigurations) => {
  const { t } = useTranslation();
  const [name, setName] = useState(queryModel.name);
  useEffect(() => {
    setName(queryModel.name);
  }, [queryModel.name]);
  return (
    <Center ml={20} mt={20} sx={{ maxWidth: '600px' }}>
      <Stack gap={10} sx={{ width: '100%' }}>
        <Divider mb={-10} variant="dashed" label={t('query.basics')} labelPosition="center" />
        <TextInput
          placeholder={t('query.name_description')}
          label={t('query.name')}
          required
          sx={{ flex: 1 }}
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
          rightSection={
            <ActionIcon
              variant="filled"
              color="blue"
              size="sm"
              onClick={() => queryModel.setName(name)}
              disabled={name === queryModel.name}
            >
              <IconDeviceFloppy size={16} />
            </ActionIcon>
          }
          onBlur={() => {
            queryModel.setName(name);
          }}
        />
        <SelectDataSource queryModel={queryModel} />
        <Divider mt={10} mb={-10} variant="dashed" label={t('query.conditions')} labelPosition="center" />
        <MultiSelect
          label={t('query.run_by_condition.label')}
          description={t('query.run_by_condition.description')}
          placeholder={t('query.run_by_condition.unset')}
          data={queryModel.conditionOptions}
          value={[...queryModel.run_by]}
          onChange={queryModel.setRunBy}
          renderOption={CustomSelectorItem}
          maxDropdownHeight={500}
        />
        {queryModel.typedAsHTTP && (
          <MultiSelect
            label={t('query.re_run_condition.label')}
            placeholder={t('query.re_run_condition.label')}
            data={queryModel.conditionOptions}
            value={[...queryModel.react_to]}
            onChange={queryModel.setReactTo}
            renderOption={CustomSelectorItem}
            maxDropdownHeight={500}
          />
        )}

        <Divider mt={20} mb={10} variant="dashed" />
        <DeleteQuery queryModel={queryModel} />
      </Stack>
    </Center>
  );
});
