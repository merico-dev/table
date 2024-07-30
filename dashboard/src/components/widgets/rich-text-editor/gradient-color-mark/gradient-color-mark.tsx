import { Mark } from '@tiptap/core';
import '@tiptap/extension-text-style';
import { ensurePrefixOnID, getGradientColorID } from './utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    gradientColor: {
      setGradientColors: (colors: string) => ReturnType;
      setGradientMinValue: (value: number | string) => ReturnType;
      setGradientMaxValue: (value: number | string) => ReturnType;
      setGradientVariable: (variableKey: string) => ReturnType;
      unsetGradientColor: () => ReturnType;
    };
  }
}

const ColorAttrKey = 'data-colors';
const MinAttrKey = 'data-min';
const MaxAttrKey = 'data-max';
const VariableAttrKey = 'data-var';
export const GradientColorAttrKeys = {
  color: ColorAttrKey,
  min: MinAttrKey,
  max: MaxAttrKey,
  variable: VariableAttrKey,
};
export const GradientColorName = 'gradientColor';

export const GradientColorMark = Mark.create({
  name: GradientColorName,

  addAttributes() {
    return {
      id: {
        default: getGradientColorID(6),
        parseHTML: (element) => {
          const id = element.getAttribute('id');
          return ensurePrefixOnID(id);
        },
      },
      [ColorAttrKey]: {
        default: [],
        parseHTML: (element) => {
          const v = element.getAttribute(ColorAttrKey);
          if (!v) {
            return [];
          }
          const ret = JSON.parse(v);
          if (Array.isArray(ret)) {
            return ret;
          }
          console.error(`[GradientColorMark] ${ColorAttrKey} should be an JSON array`);
        },
      },
      [MinAttrKey]: {
        default: 0,
        parseHTML: (element) => {
          const v = element.getAttribute(MinAttrKey);
          return v;
        },
      },
      [MaxAttrKey]: {
        default: 100,
        parseHTML: (element) => {
          const v = element.getAttribute(MaxAttrKey);
          return v;
        },
      },
      [VariableAttrKey]: {
        default: '',
        parseHTML: (element) => {
          const v = element.getAttribute(VariableAttrKey);
          return v;
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'gradient-color',
        getAttrs: (node: string | HTMLElement) => {
          if (typeof node === 'string') {
            console.debug(node);
            return false;
          }
          return Object.values(GradientColorAttrKeys).map((k) => node.getAttribute(k));
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['gradient-color', HTMLAttributes, 0];
  },

  addCommands() {
    return {
      setGradientColors:
        (v) =>
        ({ commands }) => {
          return commands.setMark(this.name, {
            [ColorAttrKey]: v,
          });
        },
      setGradientMinValue:
        (v) =>
        ({ commands }) => {
          return commands.setMark(this.name, {
            [MinAttrKey]: v,
          });
        },
      setGradientMaxValue:
        (v) =>
        ({ commands }) => {
          return commands.setMark(this.name, {
            [MaxAttrKey]: v,
          });
        },
      setGradientVariable:
        (v) =>
        ({ commands }) => {
          return commands.setMark(this.name, {
            [VariableAttrKey]: v,
          });
        },
      unsetGradientColor:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
