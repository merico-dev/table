import { Mark } from '@tiptap/core';
import '@tiptap/extension-text-style';
import { ensurePrefixOnID, getColorMappingID } from './utils';
import { ColorMappingFormValues } from './color-mapping-form';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    colorMapping: {
      setColorMapping: (values: ColorMappingFormValues) => ReturnType;
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
export const ColorMappingName = 'colorMapping';

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
          return v.split(',');
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
      setColorMapping:
        (values) =>
        ({ commands }) => {
          const { colors, min_val, min_var, max_val, max_var, variable } = values;
          return commands.setMark(this.name, {
            [Keys.color]: colors.join(','),
            [Keys.min_val]: min_val,
            [Keys.min_var]: min_var,
            [Keys.max_val]: max_val,
            [Keys.max_var]: max_var,
            [Keys.variable]: variable,
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
