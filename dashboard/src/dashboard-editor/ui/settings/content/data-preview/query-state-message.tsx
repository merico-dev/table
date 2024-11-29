import { Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useRenderContentModelContext } from '~/contexts';

interface IQueryStateMessage {
  queryID: string;
}
export const QueryStateMessage = observer(({ queryID }: IQueryStateMessage) => {
  const model = useRenderContentModelContext();
  const query = React.useMemo(() => model.queries.findByID(queryID), [model, queryID]);
  if (!query) {
    return null;
  }

  if (query.state === 'loading') {
    return null;
  }
  const { error, metricQueryPayloadErrorString, stateMessage } = query;
  if (!!error || !!metricQueryPayloadErrorString) {
    return (
      <Text mt={10} c="red" size="md" ta="center" ff="monospace">
        {error ?? metricQueryPayloadErrorString}
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
