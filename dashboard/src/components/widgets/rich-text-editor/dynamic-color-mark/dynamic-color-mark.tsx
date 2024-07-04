import { Mark, mergeAttributes } from '@tiptap/core';
import '@tiptap/extension-text-style';
import _ from 'lodash';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    dynamicColor: {
      setDynamicColor: (fontSize: string) => ReturnType;
      unsetDynamicColor: () => ReturnType;
    };
  }
}

const AttrKey = 'data-dynamic-color';

export const DynamicColorMark = Mark.create({
  name: 'dynamicColor',

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
    const attrs = _.omit(HTMLAttributes, [AttrKey]);
    return ['span', mergeAttributes({ style: `color: ${color};` }, attrs), 0];
  },

  addCommands() {
    return {
      setDynamicColor:
        (v) =>
        ({ commands }) => {
          return commands.setMark(this.name, {
            [AttrKey]: v,
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
