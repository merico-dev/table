import React from 'react';
import { Text } from '@mantine/core';
import { useModelContext } from '~/contexts';

interface IQueryStateMessage {
  queryID: string;
}
export const QueryStateMessage = ({ queryID }: IQueryStateMessage) => {
  const model = useModelContext();
  const { state, error } = model.getDataStuffByID(queryID);
  const query = React.useMemo(() => model.queries.findByID(queryID), [model, queryID]);
  if (state === 'loading') {
    return null;
  }
  if (!!error) {
    return (
      <Text color="red" size="md" align="center" sx={{ fontFamily: 'monospace' }}>
        {error}
      </Text>
    );
  }
  if (!!query?.stateMessage) {
    return (
      <Text color="gray" align="center">
        {query.stateMessage}
      </Text>
    );
  }

  return null;
};
