import { createStyles, MantineNumberSize } from '@mantine/core';

export interface MultiSelectWidgetStylesParams {
  radius?: MantineNumberSize;
}

export default createStyles((theme, { radius = 4 }: MultiSelectWidgetStylesParams) => ({
  root: {
    borderRadius: theme.fn.radius(radius),
    display: 'flex',
    flexWrap: 'nowrap',
    border: '1px solid #ced4da',
    paddingLeft: '0px',
    paddingRight: '30px', // for the clear icon
    backgroundColor: '#fff',
    transition: 'border-color 100ms ease',
    borderColor: '#e9ecef',
    '&.rc-select.rc-select-open': {
      borderColor: '#228be6 !important',
      '.rc-select-selection-overflow-item-rest': {
        display: 'none',
      },
      '.rc-select-selection-overflow-item-suffix': {
        display: 'block',
      },
    },
    '.rc-select-selector': {
      height: 'auto',
      lineHeight: 1.55,
      paddingLeft: '12px',
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
    '.rc-select-selection-search-mirror': {
      display: 'none',
    },
    '.rc-select-selection-search': {
      flexGrow: 1,
      width: 'auto !important',
    },
    '.rc-select-selection-overflow': {
      display: 'flex',
      minHeight: '34px',
      alignItems: 'center',
      flexWrap: 'nowrap',
      marginLeft: 'calc(-10px / 2)',
      boxSizing: 'border-box',
    },
    '.rc-select-selection-overflow-item': {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f1f3f5',
      color: '#495057',
      height: '24px',
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
    '.rc-select-selection-overflow-item-rest': {
      cursor: 'pointer',
    },
    '.rc-select-selection-overflow-item-suffix': {
      display: 'none',
      backgroundColor: 'transparent',
      width: '100%',
      maxWidth: '100%',
      height: '28px',
      margin: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
    input: {
      flex: 1,
      minWidth: '60px',
      backgroundColor: 'transparent',
      border: 0,
      outline: 0,
      fontSize: '14px',
      padding: 0,
      marginLeft: 0,
      // appearance: 'none',
      color: 'inherit',
      height: '28px',
      lineHeight: '32px',
      cursor: 'pointer',
      width: '100%',
      '&::-webkit-search-decoration, &::-webkit-search-cancel-button, &::-webkit-search-results-button, &::-webkit-search-results-decoration':
        {
          display: 'none',
        },
    },
    '.rc-select-clear': {
      marginRight: '-24px',
      alignSelf: 'center',
      cursor: 'pointer',
    },
    '&.rc-select-disabled': {
      backgroundColor: 'rgb(241, 243, 245)',
      color: 'rgb(144, 146, 150)',
      opacity: 0.6,
      '&, .rc-select-selector, input': {
        cursor: 'not-allowed',
      },
    },
  },
  label: { fontSize: theme.fontSizes.sm, fontWeight: 500, color: '#212529' },

  dropdown: {
    fontSize: theme.fontSizes.xs,
    zIndex: 300,
    paddingTop: '6px',
    '&.rc-select-dropdown-slide-up-leave-active': {
      display: 'none',
    },
    '.rc-select-list, .rc-select-empty': {
      backgroundColor: '#fff',
      border: '1px solid #e9ecef',
      padding: 0,
      boxShadow: '0 1px 3px rgb(0 0 0 / 5%), rgb(0 0 0 / 5%) 0px 10px 15px -5px, rgb(0 0 0 / 4%) 0px 7px 7px -5px',
      borderRadius: '4px',
    },
    '.rc-select-empty': {
      padding: '8px 12px',
    },
  },
}));
