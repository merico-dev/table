export type SeriesOrder = {
  key: 'name' | 'value' | '';
  order: 'asc' | 'desc';
};
export const getDefaultSeriesOrder = () =>
  ({
    key: '',
    order: 'desc',
  } as SeriesOrder);
