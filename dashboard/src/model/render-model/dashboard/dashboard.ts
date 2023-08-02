import { Instance, types } from 'mobx-state-tree';
import { IDataSource } from '~/api-caller/types';

import { GlobalSQLSnippetDBType } from '~/api-caller';
import { ContextMeta, ContextRecordType, createContextMeta } from '~/model';
import { GlobalSQLSnippetsMeta } from '~/model';
import { DashboardContentDBType, IDashboard } from '~/types';
import { DataSourcesModel } from '~/dashboard-editor/model/datasources';
import { ContentRenderModel, createContentRenderModel } from './content';

export const DashboardRenderModel = types.model({
  id: types.identifier,
  name: types.string,
  group: types.string,
  content: ContentRenderModel,
  content_id: types.string,
  datasources: DataSourcesModel,
  globalSQLSnippets: GlobalSQLSnippetsMeta,
  context: ContextMeta,
});

export function createDashboardRenderModel(
  { id, name, group, content_id }: IDashboard,
  content: DashboardContentDBType,
  datasources: IDataSource[],
  globalSQLSnippets: GlobalSQLSnippetDBType[],
  context: ContextRecordType,
) {
  return DashboardRenderModel.create({
    id,
    name,
    group,
    content_id,
    content: createContentRenderModel(content),
    datasources: {
      list: datasources,
    },
    globalSQLSnippets: {
      list: globalSQLSnippets,
    },
    context: createContextMeta(context),
  });
}

export type DashboardRenderModelInstance = Instance<typeof DashboardRenderModel>;
