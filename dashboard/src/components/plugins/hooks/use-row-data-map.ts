import _ from 'lodash';
import { useMemo } from 'react';
import { parseDataKey } from '~/utils';

export function useRowDataMap(data: TPanelData, dataKey: TDataKey) {
  return useMemo(() => {
    const { queryID, columnKey } = parseDataKey(dataKey);
    return _.keyBy(data[queryID], columnKey);
  }, [data, dataKey]);
}
