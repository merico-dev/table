import { Mark } from '@tiptap/core';
import '@tiptap/extension-text-style';
import { ensurePrefixOnID, getLineHeightID } from './utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
    };
  }
}

const AttrKey = 'data-line-height';
export const LineHeightAttrKey = AttrKey;
export const LineHeightName = 'lineHeight';

export const LineHeightMark = Mark.create({
  name: LineHeightName,

  addAttributes() {
    return {
      id: {
        default: getLineHeightID(6),
        parseHTML: (element) => {
          const id = element.getAttribute('id');
          return ensurePrefixOnID(id);
        },
      },
      [AttrKey]: {
        default: null,
        parseHTML: (element) => element.getAttribute(AttrKey),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'line-height',
        getAttrs: (node: string | HTMLElement) => {
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
    const lineHeight = HTMLAttributes[AttrKey];
    if (lineHeight) {
      // Apply line-height as inline style
      return [
        'span',
        {
          ...HTMLAttributes,
          style: `line-height: ${lineHeight}`,
        },
        0,
      ];
    }
    return ['span', HTMLAttributes, 0];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight) =>
        ({ commands }) => {
          return commands.setMark(this.name, {
            [AttrKey]: lineHeight,
          });
        },
      unsetLineHeight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
