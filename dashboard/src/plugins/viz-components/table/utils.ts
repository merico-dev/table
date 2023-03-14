import { ColumnAlignType } from './type';

type JustifyType = 'flex-start' | 'center' | 'flex-end';

export const AlignmentToFlexJustify: Record<ColumnAlignType, JustifyType> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};
