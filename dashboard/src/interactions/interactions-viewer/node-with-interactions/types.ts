import { ReactNode } from 'react';

export type TInteraction =
  | {
      schemaRef: 'builtin:op:open-link';
      urlTemplate: string;
      shortURLTemplate: string;
    }
  | {
      schemaRef: 'builtin:op:set_filter_values';
      keys: [];
    }
  | {
      schemaRef: 'builtin:op:clear_filter_values';
      keys: [];
    };

export type TInteractionLine = {
  key: string;
  icon: ReactNode;
  text: ReactNode;
};
