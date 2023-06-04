import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { FilterModelInstance } from '~/model';
import { createFilterConfig_TextInput } from '~/model/filters/filter/text-input';
import { DashboardFilterType } from '~/types';

export const AddAFilter = observer(() => {
  const model = useModelContext();
  const addFilter = () => {
    const id = new Date().getTime().toString();
    const filter = {
      id,
      key: id,
      label: id,
      order: model.content.filters.current.length + 1,
      type: DashboardFilterType.TextInput,
      config: createFilterConfig_TextInput(),
      visibleInViewsIDs: ['Main'],
      auto_submit: false,
    } as FilterModelInstance;
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
      Add a Filter
    </Button>
  );
});
