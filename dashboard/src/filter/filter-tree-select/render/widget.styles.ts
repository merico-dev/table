import { createStyles, MantineNumberSize } from '@mantine/core';
import { easeIn } from 'popmotion';

export interface TreeSelectWidgetStylesParams {
  radius?: MantineNumberSize;
}

export default createStyles((theme, { radius = 4 }: TreeSelectWidgetStylesParams) => ({
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
    '&.rc-tree-select.rc-tree-select-open': {
      borderColor: '#228be6 !important',
      '.rc-tree-select-selection-overflow-item-rest': {
        display: 'none',
      },
      '.rc-tree-select-selection-overflow-item-suffix': {
        display: 'block',
      },
    },
    '.rc-tree-select-selector': {
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
    '.rc-tree-select-selection-search-mirror': {
      display: 'none',
    },
    '.rc-tree-select-selection-search': {
      flexGrow: 1,
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
    '.rc-tree-select-selection-overflow-item-rest': {
      cursor: 'pointer',
    },
    '.rc-tree-select-selection-overflow-item-suffix': {
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
    '.rc-tree-select-clear': {
      marginRight: '-24px',
      alignSelf: 'center',
      cursor: 'pointer',
    },
  },
  label: { fontSize: theme.fontSizes.sm, fontWeight: 500, color: '#212529' },

  dropdown: {
    fontSize: theme.fontSizes.xs,
    zIndex: 300,
    paddingTop: '6px',
    '&.rc-tree-select-dropdown-slide-up-leave-active': {
      display: 'none',
    },
    '.rc-tree-select-tree-list': {
      backgroundColor: '#fff',
      border: '1px solid #e9ecef',
      padding: 0,
      boxShadow: '0 1px 3px rgb(0 0 0 / 5%), rgb(0 0 0 / 5%) 0px 10px 15px -5px, rgb(0 0 0 / 4%) 0px 7px 7px -5px',
      borderRadius: '4px',
    },
    '.rc-tree-select-tree-treenode': {
      boxSizing: 'border-box',
      textAlign: 'left',
      width: '100%',
      padding: '8px 12px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#000',
      borderRadius: '4px',
      display: 'flex',
      flexWrap: 'nowrap',
      overflow: 'hidden',
      '&:hover': {
        backgroundColor: '#f1f3f5',
      },
      '&.rc-tree-select-tree-treenode-checkbox-checked': {
        '.rc-tree-select-tree-iconEle .checkbox-icon .checkmark-checked': {
          stroke: 'rgb(64, 192, 87)',
          animation: 'check 200ms linear forwards',
        },
      },
      '&.rc-tree-select-tree-treenode-checkbox-indeterminate': {
        '.rc-tree-select-tree-iconEle .checkbox-icon .checkmark-indeterminate': {
          fill: 'rgb(64, 192, 87)',
        },
      },
      '.rc-tree-select-tree-switcher': {
        height: '16px',
        alignSelf: 'center',
        paddingRight: '2px',
        transition: 'color 200ms ease',
        '&:hover': {
          color: '#228be6',
          'svg.caret-icon': {
            color: '#228be6',
          },
        },
        'svg.caret-icon': {
          color: '#ced4da',
          transition: 'all 200ms ease',
        },
      },
      '.rc-tree-select-tree-node-content-wrapper': {
        display: 'flex',
        flexWrap: 'nowrap',
        overflow: 'hidden',
        alignItems: 'center',
        gap: '2px',
        transition: 'color 200ms ease',
        '&:hover': {
          color: '#228be6',
        },
      },
      '.rc-tree-select-tree-iconEle': {
        height: '16px',
        'svg .border': {
          stroke: '#ced4da',
        },
        '.checkbox-icon .checkmark-indeterminate': {
          fill: 'transparent',
          transition: 'fill 200ms ease',
        },
        '.checkbox-icon .checkmark-checked': {
          transform: 'scale(1.2)',
          transformOrigin: 'center center',
          strokeDasharray: 10,
          strokeDashoffset: -10,
        },
        '@keyframes check': {
          '0%': {
            strokeDashoffset: 10,
          },
          '100%': {
            strokeDashoffset: 0,
          },
        },
      },
      '.rc-tree-select-tree-title': {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
      '.rc-tree-select-tree-indent': {
        flexGrow: 0,
        height: 0,
        verticalAlign: 'bottom',
      },
      '.rc-tree-select-tree-indent-unit': {
        display: 'inline-block',
        width: '1em',
      },
    },
  },
}));
