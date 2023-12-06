import { Instance, types } from 'mobx-state-tree';
import { IDataSource } from '~/api-caller/types';
import { DashboardContentDBType, IDashboard } from '../../types';
import { DataSourcesModel } from './datasources';
import { EditorModel } from './editor';

import { GlobalSQLSnippetDBType } from '~/api-caller';
import { ContextMeta, ContextRecordType, createContextMeta } from '~/model';
import { ContentModel, createContentModel } from './content';
import { GlobalSQLSnippetsMeta } from '~/model';

export const DashboardModel = types
  .model({
    id: types.identifier,
    name: types.string,
    group: types.string,
    content: ContentModel,
    content_id: types.string,
    datasources: DataSourcesModel,
    globalSQLSnippets: GlobalSQLSnippetsMeta,
    context: ContextMeta,
    editor: EditorModel,
  })
  .views((self) => ({
    get json(): IDashboard {
      return {
        id: self.id,
        name: self.name,
        group: self.group,
        content_id: self.content_id,
      };
    },
  }))
  .actions((self) => ({
    updateCurrentContent(content: DashboardContentDBType) {
      self.content.updateCurrent(content);
    },
    updateCurrent(dashboard: IDashboard, content: DashboardContentDBType) {
      const { id, name, group, content_id } = dashboard;
      self.id = id;
      self.name = name;
      self.group = group;
      self.content_id = content_id;

      this.updateCurrentContent(content);
    },
  }));

export function createDashboardModel(
  { id, name, group, content_id }: IDashboard,
  content: DashboardContentDBType,
  datasources: IDataSource[],
  globalSQLSnippets: GlobalSQLSnippetDBType[],
  context: ContextRecordType,
) {
  return DashboardModel.create({
    id,
    name,
    group,
    content_id,
    content: createContentModel(content, context),
    datasources: {
      list: datasources,
    },
    globalSQLSnippets: {
      list: globalSQLSnippets,
    },
    context: createContextMeta(context),
    editor: {},
  });
}

export type DashboardModelInstance = Instance<typeof DashboardModel>;
