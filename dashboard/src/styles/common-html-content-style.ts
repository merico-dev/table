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
  table: {
    tr: {
      'th, td': {
        padding: '0 .5em',
      },
    },
  },
  'table.rich-text-table-render, div.tableWrapper table': {
    'th, td': {
      border: '1px solid #eaeaea',
    },
    'tr:last-of-type td': {
      borderBottom: '1px solid #eaeaea',
    },
  },
  '.resize-cursor': {
    cursor: 'col-resize',
  },
  details: {
    summary: {
      listStyle: 'none',
      cursor: 'pointer',
      transition: 'color 300ms ease',
      userSelect: 'none',
    },
    'summary::-webkit-details-marker': {
      display: 'none',
    },
    'summary:hover': {
      color: 'black',
      '&::before': {
        opacity: 1,
      },
    },
    'summary::before': {
      content: '"►"',
      fontSize: '10px',
      margin: '0px 5px',
      opacity: 0.5,
      display: 'inline-block',
      transition: 'opacity 300ms ease, transform 300ms ease',
    },
  },
  'details[open] summary::before': {
    transform: 'rotate(90deg)',
  },
  'details + details': {
    marginTop: '10px',
  },
};
