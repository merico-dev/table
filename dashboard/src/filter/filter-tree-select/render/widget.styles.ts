import { createStyles, MantineNumberSize } from '@mantine/core';

export interface TreeSelectWidgetStylesParams {
  radius?: MantineNumberSize;
}

export default createStyles((theme, { radius = 4 }: TreeSelectWidgetStylesParams) => ({
  root: {
    borderRadius: theme.fn.radius(radius),
    display: 'flex',
    flexWrap: 'nowrap',
    border: '1px solid #ced4da',
    paddingLeft: '12px',
    paddingRight: '30px', // for the clear icon
    backgroundColor: '#fff',
    transition: 'border-color 100ms ease',
    borderColor: '#e9ecef',
    '.rc-tree-select-selector': {
      height: 'auto',
      lineHeight: 1.55,
      // appearance: 'none',
      resize: 'none',
      boxSizing: 'border-box',
      fontSize: '14px',
      width: '100%',
      color: '#000',
      display: 'block',
      textAlign: 'left',
      minHeight: '36px',
      cursor: 'pointer',
      flexGrow: 1,
    },
    '.rc-tree-select-selection-search-mirror': {
      display: 'none',
    },
    '.rc-tree-select-selection-overflow': {
      display: 'flex',
      minHeight: '34px',
      alignItems: 'center',
      flexWrap: 'nowrap',
      marginLeft: 'calc(-10px / 2)',
      boxSizing: 'border-box',
    },
    '.rc-tree-select-selection-overflow-item': {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f1f3f5',
      color: '#495057',
      height: '22px',
      paddingLeft: '12px',
      paddingRight: '12px',
      fontWeight: 500,
      fontSize: '12px',
      borderRadius: '4px',
      cursor: 'default',
      userSelect: 'none',
      maxWidth: 'calc(100% - 20px)',
      margin: 'calc(10px / 2 - 2px) calc(10px / 2)',
    },
    '.rc-tree-select-selection-overflow-item-suffix': {
      display: 'none',
    },
    '.rc-tree-select-clear': {
      marginRight: '-24px',
      alignSelf: 'center',
      cursor: 'pointer',
    },
    input: {
      flex: 1,
      minWidth: '60px',
      backgroundColor: 'transparent',
      border: 0,
      outline: 0,
      fontSize: '14px',
      padding: 0,
      marginLeft: 'calc(10px / 2)',
      appearance: 'none',
      color: 'inherit',
      lineHeight: '34px',
      cursor: 'pointer',
      width: '100%',
    },
  },
  label: { fontSize: theme.fontSizes.sm, fontWeight: 500, color: '#212529' },

  dropdown: { fontSize: theme.fontSizes.xs, zIndex: 300 },
}));
