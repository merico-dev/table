import { IContentRenderModel } from '../dashboard-render';
import { useContentModelContext } from './content-model-context';

export const useRenderContentModelContext = () => useContentModelContext<IContentRenderModel>();

// use a separate file to allow tsc generate proper types
