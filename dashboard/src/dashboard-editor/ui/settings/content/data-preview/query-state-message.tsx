import { Text } from '@mantine/core';
import React from 'react';
import { useRenderContentModelContext } from '~/contexts';

interface IQueryStateMessage {
  queryID: string;
}
export const QueryStateMessage = ({ queryID }: IQueryStateMessage) => {
  const model = useRenderContentModelContext();
  const { state, error } = model.getDataStuffByID(queryID);
  const query = React.useMemo(() => model.queries.findByID(queryID), [model, queryID]);
  if (state === 'loading') {
    return null;
  }
  if (!!error) {
    return (
      <Text mt={10} color="red" size="md" align="center" sx={{ fontFamily: 'monospace' }}>
        {error}
      </Text>
    );
  }
  if (!!query?.stateMessage) {
    return (
      <Text mt={10} color="gray" align="center">
        {query.stateMessage}
      </Text>
    );
  }

  return null;
};
