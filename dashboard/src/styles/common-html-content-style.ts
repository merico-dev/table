import { Sx } from '@mantine/core';

export const CommonHTMLContentStyle: Sx = {
  fontSize: '14px',
  lineHeight: '32px',
  color: '#3D3E45',
  ul: { paddingLeft: '2em', margin: '6px 0 0' },
  p: { margin: 0 },
  a: {
    WebkitTapHighlightColor: 'transparent',
    color: 'rgb(34, 139, 230)',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:active, &:hover': {
      outlineWidth: 0,
    },
  },
};
