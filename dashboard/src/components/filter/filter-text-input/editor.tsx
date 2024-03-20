import { Box, Checkbox, Group, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { FilterMetaInstance, FilterTextInputConfigInstance } from '~/model';
import { CustomDefaultValueEditor } from '../custom-default-value-editor';
import { useTranslation } from 'react-i18next';

interface IFilterEditorTextInput {
  filter: FilterMetaInstance;
}

export const FilterEditorTextInput = observer(function _FilterEditorTextInput({ filter }: IFilterEditorTextInput) {
  const { t } = useTranslation();
  const config = filter.config as FilterTextInputConfigInstance;
  return (
    <>
      <Group>
        <TextInput
          label={t('filter.widget.text_input.default_value')}
          value={config.default_value}
          onChange={(e) => {
            config.setDefaultValue(e.currentTarget.value);
          }}
          sx={{ flexGrow: 1 }}
        />
        <Box mt={22}>
          <CustomDefaultValueEditor filter={filter} />
        </Box>
      </Group>
      <Checkbox
        checked={config.required}
        onChange={(e) => config.setRequired(e.currentTarget.checked)}
        label={t('filter.widget.text_input.required')}
      />
    </>
  );
});
