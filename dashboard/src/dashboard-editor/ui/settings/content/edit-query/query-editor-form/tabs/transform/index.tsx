import { Box, MultiSelect, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { InlineFunctionInput } from '~/components/widgets/inline-function-input';
import { useEditContentModelContext } from '~/contexts';
import { QueryRenderModelInstance } from '~/model';

export const DEFAULT_TRANSFORM_REQ_PROCESSING = {
  pre: [
    'function transform(queries, state, utils) {',
    '    // use queries & dashboar state to build new data',
    '    const data = []',
    '    return data',
    '}',
  ].join('\n'),
  post: '',
};

export const TabPanel_Transform = observer(({ queryModel }: { queryModel: QueryRenderModelInstance }) => {
  const { t } = useTranslation();
  const content = useEditContentModelContext();

  if (!queryModel.isTransform) {
    return null;
  }

  return (
    <Stack py={20} px={20} sx={{ height: '100%' }}>
      <Text size="sm">{t('query.transform.guide.pick_queries')}</Text>
      <MultiSelect
        data={content.queries.optionsWithoutTransform}
        value={[...queryModel.dep_query_ids]}
        onChange={queryModel.setDependantQueryIDs}
        maxDropdownHeight={800}
      />
      <Text size="sm">{t('query.transform.guide.write_function')}</Text>
      <Box sx={{ flexGrow: 1 }}>
        <InlineFunctionInput
          label=""
          value={queryModel.pre_process}
          onChange={queryModel.setPreProcess}
          defaultValue={DEFAULT_TRANSFORM_REQ_PROCESSING.pre}
        />
      </Box>
    </Stack>
  );
});
