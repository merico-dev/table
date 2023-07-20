import React from 'react';
import { ContentModelInstance } from '~/dashboard-editor/model/content';

const ContentModelContext = React.createContext<ContentModelInstance | null>(null);

export const ContentModelContextProvider = ContentModelContext.Provider;

export function useContentModelContext() {
  const model = React.useContext(ContentModelContext);
  if (!model) {
    throw new Error('Please use ContentModelContextProvider');
  }
  return model;
}
