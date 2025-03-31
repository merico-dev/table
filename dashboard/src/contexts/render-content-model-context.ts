import { IContentRenderModel } from '../dashboard-render';
import { useDashboardContext } from './dashboard-context';

export const useRenderDashboardContext = () => useDashboardContext<IContentRenderModel>();

// use a separate file to allow tsc generate proper types
