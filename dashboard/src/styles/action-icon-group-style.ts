export const ActionIconGroupStyle = {
  '> button': {
    '&:first-of-type': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRightWidth: 0.5,
    },
    ':not(:first-of-type):not(:last-of-type)': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderLeftWidth: 0.5,
      borderRightWidth: 0.5,
    },
    '&:last-of-type': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderLeftWidth: 0.5,
    },
  },
};
