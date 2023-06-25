/**
 * extract queryID & columnKey from dataKey
 * @param dataKey queryID.columnKey or queryID
 * @returns
 */
export function parseDataKey(dataKey: string) {
  const [queryID, columnKey] = dataKey.split('.');
  return { queryID, columnKey };
}

/**
 * extract rows from panel data
 * @param data TPanelData
 * @param dataKey queryID.columnKey or queryID
 */
export function extractData(data: TPanelData, dataKey: string) {
  const { queryID, columnKey } = parseDataKey(dataKey);
  if (!queryID) {
    return [];
  }
  if (!columnKey) {
    return data[queryID];
  }
  return data[queryID]?.map((d) => d[columnKey]) ?? [];
}

/**
 * extract full query data from panel data
 * @param data TPanelData
 * @param dataKey queryID.columnKey or queryID. columnKey will be ignored
 */
export function extractFullQueryData(data: TPanelData, dataKey: string) {
  const { queryID } = parseDataKey(dataKey);
  if (!queryID) {
    return [];
  }
  return data[queryID];
}
