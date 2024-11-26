export const ComboBoxStyles = {
  option: {
    fontFamily: 'monospace',
    '&.sub-option': {
      position: 'relative',
      marginLeft: '22px',
    },
    '&.sub-option::before': {
      content: '""',
      width: '1px',
      height: '100%',
      position: 'absolute',
      left: '-6px',
      borderLeft: '1px solid #E7E7E9',
    },
  },
  groupLabel: {
    cursor: 'default',
    fontWeight: 'normal',
    '&::before': {
      content: '""',
      flex: 1,
      insetInline: 0,
      height: 'calc(0.0625rem* var(--mantine-scale))',
      marginInlineEnd: 'var(--mantine-spacing-xs)',
      backgroundColor: 'var(--mantine-color-gray-2)',
    },
  },
  group: {
    '&.dimension-group': {
      paddingBottom: '4px',
      '.mantine-Combobox-groupLabel': {
        color: '#000',
      },
      '.mantine-Combobox-groupLabel::before': {
        display: 'none',
      },
      '.mantine-Combobox-groupLabel::after': {
        display: 'none',
      },
    },
  },
};

export const getInputStyles = (label?: string) => ({
  root: {
    maxWidth: 'unset',
  },
  option: {
    fontFamily: 'monospace',
  },
  section: {
    '&[data-position="left"]': {
      width: label ? '70px' : '0px',
      justifyContent: 'flex-start',
    },
  },
  input: {
    paddingInlineStart: label ? '70px' : 'var(--input-padding-inline-start)',
    color: 'gray',
    fontFamily: 'monospace',
  },
});
