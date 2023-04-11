export type PresenceType = {
  [key: string]: {
    // [id:type]: { type, name, count }
    type: string;
    name: string;
    count: number;
  };
};

export type PresenceDataItemType = 'APIKEY' | 'ACCOUNT';

export type PresenceDataItem = {
  id: string;
  type: PresenceDataItemType;
  name: string;
  count: number;
};
