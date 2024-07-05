import { TDashboardState, VariableValueMap } from '~/model';
import { functionUtils } from '~/utils';

const head = 'function color({ variables }, { filters, context }, utils) {';
const tail = '}';
export const DefaultDynamicColorFuncLines = [head, '    return "red";', tail];
export const DefaultDynamicColorFunc = DefaultDynamicColorFuncLines.join('\n');

// TODO: use it after https://github.com/merico-dev/table/issues/1455
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

// TODO: use it after https://github.com/merico-dev/table/issues/1455
export const completeDynamicColorFunc = (trimmed: string) => {
  if (!trimmed || trimmed.startsWith(head)) {
    return trimmed;
  }
  return [head, trimmed, tail].join('\n');
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

export function getDynamicColorStyles(doc: Document, dashboardState: TDashboardState, variables: VariableValueMap) {
  const ret: Record<string, { color: string }> = {};
  const run = (body: string) => {
    return new Function(`return ${completeDynamicColorFunc(body)}`)()({ variables }, dashboardState, functionUtils);
  };
  const nodes = doc.querySelectorAll('dynamic-color');
  nodes.forEach((n) => {
    const value = n.getAttribute('data-value');
    if (!value) {
      return;
    }
    ret[`#${n.id}`] = {
      color: run(value),
    };
  });

  return ret;
}
