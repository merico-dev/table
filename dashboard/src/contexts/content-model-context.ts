import React from 'react';
import { ContentModelInstance } from '~/dashboard-editor/model/content';
import { ContentRenderModelInstance } from '~/dashboard-render/model/content';
import { IContentRenderModel } from '../dashboard-render/model/types';

export const ContentModelContext = React.createContext<ContentModelInstance | ContentRenderModelInstance | null>(null);

export const ContentModelContextProvider = ContentModelContext.Provider;

function useContentModelContext<T = ContentModelInstance>() {
  const model = React.useContext(ContentModelContext);
  if (!model) {
    throw new Error('Please use ContentModelContextProvider');
  }
  return model as T;
}
export const useEditContentModelContext = () => useContentModelContext<ContentModelInstance>();
export const useRenderContentModelContext = () => useContentModelContext<IContentRenderModel>();
