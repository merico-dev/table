import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext } from '~/contexts';
import { FilterMetaInstance, createFilterTextInputConfig } from '~/model';
import { DashboardFilterType } from '~/types';

export const AddAFilter = observer(() => {
  const { t } = useTranslation();
  const model = useEditDashboardContext();
  const addFilter = () => {
    const id = new Date().getTime().toString();
    const filter = {
      id,
      key: id,
      label: id,
      order: model.content.filters.current.length + 1,
      type: DashboardFilterType.TextInput,
      config: createFilterTextInputConfig(),
      visibleInViewsIDs: ['Main'],
      auto_submit: false,
    } as FilterMetaInstance;
    model.content.filters.append(filter);
    model.editor.setPath(['_FILTERS_', id]);
  };

  return (
    <Button
      variant="subtle"
      leftIcon={<IconPlus size={14} />}
      size="sm"
      px="xs"
      mb={10}
      color="blue"
      onClick={addFilter}
      sx={{ width: '100%', borderRadius: 0 }}
      styles={{
        inner: {
          justifyContent: 'flex-start',
        },
      }}
    >
      {t('filter.add')}
    </Button>
  );
});
