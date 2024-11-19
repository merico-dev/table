import { Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useRenderContentModelContext } from '~/contexts';

interface IQueryStateMessage {
  queryID: string;
}
export const QueryStateMessage = observer(({ queryID }: IQueryStateMessage) => {
  const model = useRenderContentModelContext();
  const { state, error } = model.getDataStuffByID(queryID);
  const query = React.useMemo(() => model.queries.findByID(queryID), [model, queryID]);
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
  if (!!query?.stateMessage) {
    return (
      <Text size="sm" mt={10} c="gray" ta="center">
        {query.stateMessage}
      </Text>
    );
  }

  return null;
});
