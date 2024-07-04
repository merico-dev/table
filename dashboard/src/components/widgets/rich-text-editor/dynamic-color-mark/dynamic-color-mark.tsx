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
      [AttrKey]: null,
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node: string | HTMLElement) => {
          if (typeof node === 'string') {
            return false;
          }

          const hasDynamicColor = node.hasAttribute(AttrKey);
          console.log(node.getAttribute(AttrKey));
          if (!hasDynamicColor) {
            return false;
          }
          // TODO
          return [node.getAttribute(AttrKey)];
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    console.log('🔴 renderHTML: ', HTMLAttributes);
    const v = HTMLAttributes[AttrKey];
    let color = 'yellow';
    if (v === '8px') {
      color = 'red';
    } else if (v === '10px') {
      color = 'blue';
    } else {
      color = 'yellow';
    }

    const attrs = mergeAttributes({ style: `background-color: ${color};`, class: 'rte-dynamic-color' }, HTMLAttributes);
    console.log('attrs: ', attrs);
    return ['span', attrs, 0];
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
