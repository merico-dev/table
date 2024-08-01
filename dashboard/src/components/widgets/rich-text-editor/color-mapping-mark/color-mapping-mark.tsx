import { Mark } from '@tiptap/core';
import '@tiptap/extension-text-style';
import { ensurePrefixOnID, getColorMappingID } from './utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    gradientColor: {
      setColorMappings: (colors: string) => ReturnType;
      setGradientMinValue: (variableKey: string) => ReturnType;
      setGradientMinVar: (variableKey: string) => ReturnType;
      setGradientMaxValue: (value: number | string) => ReturnType;
      setGradientMaxVar: (variableKey: number | string) => ReturnType;
      setGradientVariable: (variableKey: string) => ReturnType;
      unsetColorMapping: () => ReturnType;
    };
  }
}

const Keys = {
  color: 'data-colors',
  min_val: 'data-min-val',
  min_var: 'data-min-var',
  max_val: 'data-max-val',
  max_var: 'data-max-var',
  variable: 'data-var',
};
export const ColorMappingAttrKeys = Keys;
export const ColorMappingName = 'gradientColor';

export const ColorMappingMark = Mark.create({
  name: ColorMappingName,

  addAttributes() {
    return {
      id: {
        default: getColorMappingID(6),
        parseHTML: (element) => {
          const id = element.getAttribute('id');
          return ensurePrefixOnID(id);
        },
      },
      [Keys.color]: {
        default: [],
        parseHTML: (element) => {
          const v = element.getAttribute(Keys.color);
          if (!v) {
            return [];
          }
          const ret = JSON.parse(v);
          if (Array.isArray(ret)) {
            return ret;
          }
          console.error(`[ColorMappingMark] ${Keys.color} should be an JSON array`);
        },
      },
      [Keys.min_val]: {
        default: 0,
        parseHTML: (element) => {
          const v = element.getAttribute(Keys.min_val);
          return v;
        },
      },
      [Keys.min_var]: {
        default: '',
        parseHTML: (element) => {
          const v = element.getAttribute(Keys.min_var);
          return v;
        },
      },
      [Keys.max_val]: {
        default: 100,
        parseHTML: (element) => {
          const v = element.getAttribute(Keys.max_val);
          return v;
        },
      },
      [Keys.max_var]: {
        default: '',
        parseHTML: (element) => {
          const v = element.getAttribute(Keys.max_var);
          return v;
        },
      },
      [Keys.variable]: {
        default: '',
        parseHTML: (element) => {
          const v = element.getAttribute(Keys.variable);
          return v;
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'color-mapping',
        getAttrs: (node: string | HTMLElement) => {
          if (typeof node === 'string') {
            console.debug(node);
            return false;
          }
          return Object.values(ColorMappingAttrKeys).map((k) => node.getAttribute(k));
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['color-mapping', HTMLAttributes, 0];
  },

  addCommands() {
    return {
      setColorMappings:
        (v) =>
        ({ commands }) => {
          return commands.setMark(this.name, {
            [Keys.color]: v,
          });
        },
      setGradientMinValue:
        (v) =>
        ({ commands }) => {
          return commands.setMark(this.name, {
            [Keys.min_val]: v,
          });
        },
      setGradientMinVar:
        (v) =>
        ({ commands }) => {
          return commands.setMark(this.name, {
            [Keys.min_var]: v,
          });
        },
      setGradientMaxValue:
        (v) =>
        ({ commands }) => {
          return commands.setMark(this.name, {
            [Keys.max_val]: v,
          });
        },
      setGradientMaxVar:
        (v) =>
        ({ commands }) => {
          return commands.setMark(this.name, {
            [Keys.max_var]: v,
          });
        },
      setGradientVariable:
        (v) =>
        ({ commands }) => {
          return commands.setMark(this.name, {
            [Keys.variable]: v,
          });
        },
      unsetColorMapping:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
