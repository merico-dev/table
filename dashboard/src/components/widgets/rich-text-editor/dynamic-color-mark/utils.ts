export const DefaultDynamicColorFuncLines = [
  'function color({ variables }, { filters, context }, utils) {',
  '    return "red";',
  '}',
];
export const DefaultDynamicColorFunc = DefaultDynamicColorFuncLines.join('\n');

export const trimDynamicColorFunc = (raw: string) => {
  if (!raw) {
    return raw;
  }
  const ret = raw
    .replace(DefaultDynamicColorFuncLines[0], '')
    .replace(/[\r\n]+/gm, '')
    .replace(/(.+)\}$/, '$1')
    .trim();
  return ret;
};

export const hashID = (size: number) => {
  const MASK = 0x3d;
  const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
  const NUMBERS = '1234567890';
  const charset = `${NUMBERS}${LETTERS}${LETTERS.toUpperCase()}`.split('');

  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);

  return bytes.reduce((acc, byte) => `${acc}${charset[byte & MASK]}`, '');
};
