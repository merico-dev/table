import { TDashboardState, VariableValueMap } from '~/model';
import { functionUtils } from '~/utils';
import { MonacoEditorRestriction } from '../../function-editor';

const head = 'function color({ variables }, { filters, context }, utils) {';
const tail = '}';
export const DefaultDynamicColorFuncLines = [head, '    return "red";', tail];
export const DefaultDynamicColorFunc = DefaultDynamicColorFuncLines.join('\n');
export function getDynamicColorRestrictions(code: string): MonacoEditorRestriction[] {
  if (!code) {
    return [];
  }
  const lines = code.split('\n');

  const lastLineIndex = lines.length + 1;
  let lastLineColumn = 1;
  const lastContentLine = lines[lines.length - 1];
  if (lastContentLine) {
    lastLineColumn = lastContentLine.length + 1;
  }

  return [
    {
      range: [2, 1, lastLineIndex, lastLineColumn],
      label: 'body',
      allowMultiline: true,
    },
  ];
}

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

export const DynamicColorIDPrefix = 'dyn_color_';
export const IDPrefixReg = new RegExp(`^(?!${DynamicColorIDPrefix})(.+)$`);
export function ensurePrefixOnID(id: string | null) {
  if (!id) {
    return id;
  }
  return id.replace(IDPrefixReg, `${DynamicColorIDPrefix}$1`);
}

export const getDynamicColorID = (size: number) => {
  const MASK = 0x3d;
  const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
  const NUMBERS = '1234567890';
  const charset = `${NUMBERS}${LETTERS}${LETTERS.toUpperCase()}`.split('');

  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);

  const id = bytes.reduce((acc, byte) => `${acc}${charset[byte & MASK]}`, '');
  return `${DynamicColorIDPrefix}${id}`;
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
    ret[`#${ensurePrefixOnID(n.id)}`] = {
      color: run(value),
    };
  });

  return ret;
}
