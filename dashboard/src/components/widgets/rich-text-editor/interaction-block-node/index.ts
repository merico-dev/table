// create custom block node for tiptap editor
// it will wrap its content with a div[data-interaction-block-id=xxxx]

import { Node, mergeAttributes } from '@tiptap/core';

export interface InteractionBlockOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    interactionBlock: {
      /**
       * Set an interaction block with a specific ID
       */
      setInteractionBlock: (blockId: string) => ReturnType;
      /**
       * Toggle an interaction block
       */
      toggleInteractionBlock: (blockId: string) => ReturnType;
      /**
       * Unset an interaction block
       */
      unsetInteractionBlock: () => ReturnType;
    };
  }
}

export const InteractionBlock = Node.create<InteractionBlockOptions>({
  name: 'interactionBlock',

  group: 'block',

  content: 'block+',

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      blockId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-interaction-block-id'),
        renderHTML: (attributes) => {
          if (!attributes.blockId) {
            return {};
          }
          return {
            'data-interaction-block-id': attributes.blockId,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-interaction-block-id]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setInteractionBlock:
        (blockId: string) =>
        ({ commands }) => {
          return commands.wrapIn(this.name, { blockId });
        },
      toggleInteractionBlock:
        (blockId: string) =>
        ({ commands }) => {
          return commands.toggleWrap(this.name, { blockId });
        },
      unsetInteractionBlock:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-i': () => this.editor.commands.toggleInteractionBlock(''),
    };
  },
});
