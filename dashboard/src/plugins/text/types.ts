export interface IParagraph {
  align: 'center' | 'left' | 'right';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight: string | number;
  color: string;
  template: string;
}

export interface ITextViewProps {
  paragraphs: IParagraph[];
}

export const CONF = 'config';
