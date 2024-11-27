import { CodeHighlight } from '@mantine/code-highlight';
import { Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { MericoMetricQueryMetaInstance } from '~/model';

type Props = {
  queryModel: QueryModelInstance;
};
export const PreviewMetricQuery = observer(({ queryModel }: Props) => {
  const config = queryModel.config as MericoMetricQueryMetaInstance;

  return (
    <Stack>
      <CodeHighlight
        language="json"
        sx={{ width: '100%', height: '100%', minHeight: '400px', overflowY: 'auto' }}
        withCopyButton={false}
        code={queryModel.metricQueryPayloadString}
      />
    </Stack>
  );
});
