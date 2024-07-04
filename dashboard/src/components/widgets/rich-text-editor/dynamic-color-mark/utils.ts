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
