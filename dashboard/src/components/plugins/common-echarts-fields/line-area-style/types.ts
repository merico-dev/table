export type EchartsLineAreaStyle = {
  enabled: boolean;
  color: string;
  origin: 'auto' | 'start' | 'end';
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  opacity: number;
};

export function getDefaultLineAreaStyle(): EchartsLineAreaStyle {
  return {
    enabled: false,
    color: '',
    origin: 'auto',
    shadowBlur: 0,
    shadowColor: '',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    opacity: 0.7,
  };
}
