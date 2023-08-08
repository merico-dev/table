import { AnyObject } from '..';

/**
 * extract queryID & columnKey from dataKey
 * @param dataKey queryID.columnKey or queryID
 * @returns
 */
export function parseDataKey(dataKey: TDataKey) {
  const [queryID, columnKey] = dataKey.split('.');
  return { queryID, columnKey };
}

export function parseDataKeyOrColumnKey(dataKeyOrColumnKey: TDataKey) {
  if (!dataKeyOrColumnKey.includes('.')) {
    return { queryID: '', columnKey: dataKeyOrColumnKey };
  }
  return parseDataKey(dataKeyOrColumnKey);
}

/**
 * extract rows from panel data
 * @param data TPanelData
 * @param dataKey queryID.columnKey or queryID
 */
export function extractData(data: TPanelData, dataKey: TDataKey) {
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
export function extractFullQueryData(data: TPanelData, dataKey: TDataKey) {
  const { queryID } = parseDataKey(dataKey);
  if (!queryID) {
    return [];
  }
  return data[queryID];
}

export function extractOneQueryData(data: TPanelData): TQueryData | undefined {
  return Object.values(data)[0];
}

export function readColumnIgnoringQuery(row: AnyObject, dataKey: TDataKey) {
  const { queryID, columnKey } = parseDataKey(dataKey);
  return row[columnKey];
}
