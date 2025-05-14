import { TAdditionalQueryInfo } from '../../api-caller/request';
import {
  IFiltersRenderModel,
  ILayoutsRenderModel,
  IMockContextMeta,
  IPanelsRenderModel,
  IQueriesRenderModel,
  ISQLSnippetsRenderModel,
  IViewsRenderModel,
  TDashboardStateValues,
  TPayloadForSQL,
  TPayloadForViz,
} from '../../model';
import { DashboardContentDBType } from '../../types';

export interface IContentRenderModel {
  id: string;
  name: string;
  dashboard_id: string;
  create_time: string;
  update_time: string;
  version: string;
  filters: IFiltersRenderModel;
  queries: IQueriesRenderModel;
  sqlSnippets: ISQLSnippetsRenderModel;
  views: IViewsRenderModel;
  panels: IPanelsRenderModel;
  layouts: ILayoutsRenderModel;
  mock_context: IMockContextMeta;

  readonly json: DashboardContentDBType;
  readonly contentJSON: DashboardContentDBType['content'];
  readonly payloadForSQL: TPayloadForSQL;
  readonly payloadForViz: TPayloadForViz;
  readonly dashboardState: TDashboardStateValues;

  getAdditionalQueryInfo(query_id: string): TAdditionalQueryInfo;

  readonly data: Record<string, TQueryData>;

  getDataStuffByID(queryID: string): {
    data: TQueryData;
    len: number;
    state: string;
    error?: string;
  };
}
