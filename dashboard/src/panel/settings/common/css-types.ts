export type TJustifyContent = 'center' | 'left' | 'right' | 'space-between' | 'space-around' | 'space-evenly';
// | 'stretch';

export const JustifyContentOptions: { label: string; value: TJustifyContent }[] = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
  { label: 'Space Between', value: 'space-between' },
  { label: 'Space Around', value: 'space-around' },
  { label: 'Space Evenly', value: 'space-evenly' },
  // { label: 'Stretch', value: 'stretch' },
];

export type TAlignItems = 'start' | 'center' | 'end' | 'stretch';

export const AlignItemsOptions: { label: string; value: TAlignItems }[] = [
  { label: 'Start', value: 'start' },
  { label: 'Center', value: 'center' },
  { label: 'End', value: 'end' },
  { label: 'Stretch', value: 'stretch' },
];
