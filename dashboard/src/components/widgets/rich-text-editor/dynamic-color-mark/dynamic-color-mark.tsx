import { Mark, mergeAttributes } from '@tiptap/core';
import '@tiptap/extension-text-style';
import _ from 'lodash';
import { trimDynamicColorFunc } from './utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    dynamicColor: {
      setDynamicColor: (fontSize: string) => ReturnType;
      unsetDynamicColor: () => ReturnType;
    };
  }
}

const AttrKey = 'data-dynamic-color';
export const DynamicColorAttrKey = AttrKey;
export const DynamicColorName = 'dynamicColor';

export const DynamicColorMark = Mark.create({
  name: DynamicColorName,

  addAttributes() {
    return {
      [AttrKey]: {
        parseHTML: (element) => element.getAttribute(AttrKey),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'dynamic-color',
        getAttrs: (node: string | HTMLElement) => {
          console.log('🔵 getAttrs', node);
          if (typeof node === 'string') {
            console.debug(node);
            return false;
          }

          return [node.getAttribute(AttrKey)];
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    console.log('🔴 renderHTML: ', HTMLAttributes);
    const v = HTMLAttributes[AttrKey];

    const attrs = mergeAttributes({}, HTMLAttributes);
    console.log('attrs: ', attrs);
    return ['dynamic-color', attrs, 0];
  },

  addCommands() {
    return {
      setDynamicColor:
        (v) =>
        ({ commands }) => {
          const value = trimDynamicColorFunc(v);
          return commands.setMark(this.name, {
            [AttrKey]: value,
          });
        },
      unsetDynamicColor:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
