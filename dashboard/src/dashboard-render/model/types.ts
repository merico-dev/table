import { TAdditionalQueryInfo } from '../../api-caller/request';
import {
  IFiltersRenderModel,
  ILayoutsRenderModel,
  IMockContextMeta,
  IPanelsRenderModel,
  IQueriesRenderModel,
  type IQueryRenderModelData,
  ISQLSnippetsRenderModel,
  IViewsRenderModel,
  TPayloadForSQL,
  TPayloadForViz,
} from '../../model';
import { DashboardContentDBType } from '../../types';
import { payloadToDashboardState } from '../../utils';

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
  readonly dashboardState: ReturnType<typeof payloadToDashboardState>;

  getAdditionalQueryInfo(query_id: string): TAdditionalQueryInfo;

  readonly data: Record<string, IQueryRenderModelData>;

  getDataStuffByID(queryID: string): {
    data: IQueryRenderModelData;
    len: number;
    state: string;
    error?: string;
  };
}
