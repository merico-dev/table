import { observer } from 'mobx-react-lite';
import { DashboardFilterType, FilterMetaInstance } from '~/model';
import { ModalFunctionEditor } from '../widgets/modal-function-editor';
import { IconMathFunction } from '@tabler/icons-react';
import { Alert, List } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const defaultFilterValueDict = {
  [DashboardFilterType.Checkbox]: 'true',
  [DashboardFilterType.DateRange]: "[new Date('2023-01-01 00:00:00'), new Date('2024-01-01 00:00:00')]",
  [DashboardFilterType.MultiSelect]: '[]',
  [DashboardFilterType.Select]: '""',
  [DashboardFilterType.TreeSelect]: '[]',
  [DashboardFilterType.TextInput]: '""',
};

const getDefaultValueFuncTemplate = (type: DashboardFilterType) => {
  return [
    'function getDefaultValue(filter, utils, context) {',
    `    return ${defaultFilterValueDict[type]};`,
    '}',
  ].join('\n');
};

type Props = {
  filter: FilterMetaInstance;
};

export const CustomDefaultValueEditor = observer(({ filter }: Props) => {
  const { t } = useTranslation();
  return (
    <ModalFunctionEditor
      label=""
      title={t('filter.field.custom_default_value.title')}
      triggerLabel={t('filter.field.custom_default_value.trigger')}
      value={filter.default_value_func}
      onChange={filter.setDefaultValueFunc}
      defaultValue={getDefaultValueFuncTemplate(filter.type)}
      triggerButtonProps={{
        size: 'xs',
        color: 'grape',
        sx: { flexGrow: 0, alignSelf: 'flex-start' },
        leftIcon: <IconMathFunction size={16} />,
      }}
      description={
        <Alert title={t('filter.field.custom_default_value.tips')} color="gray" mb={16}>
          <List size={13} type="ordered">
            <List.Item>{t('filter.field.custom_default_value.tip_1')}</List.Item>
            <List.Item>{t('filter.field.custom_default_value.tip_2')}</List.Item>
          </List>
        </Alert>
      }
    />
  );
});
