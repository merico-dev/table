import { Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';

type Props = {
  queryModel: QueryModelInstance;
};
export const QueryStateMessage = observer(({ queryModel }: Props) => {
  const { state, error, metricQueryPayloadError, stateMessage } = queryModel;
  if (state === 'loading') {
    return null;
  }
  if (!!error) {
    return (
      <Text mt={10} c="red" size="md" ta="center" ff="monospace">
        {error}
      </Text>
    );
  }
  if (!!metricQueryPayloadError) {
    return (
      <Text mt={10} c="red" size="md" ta="center" ff="monospace">
        {metricQueryPayloadError}
      </Text>
    );
  }
  if (!!stateMessage) {
    return (
      <Text size="sm" mt={10} c="gray" ta="center">
        {stateMessage}
      </Text>
    );
  }

  return null;
});
