export type PresenceType = {
  [key: string]: {
    // [id:type]: { type, name, count }
    type: string;
    name: string;
    count: number;
  };
};

export type PresenceDataItem = {
  id: string;
  type: string;
  name: string;
  count: number;
};
