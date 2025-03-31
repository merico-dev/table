import _ from 'lodash';
import {
  getRoot,
  Instance,
  SnapshotIn,
  IMSTArray,
  ISimpleType,
  IStateTreeNode,
  IOptionalIType,
  IArrayType,
} from 'mobx-state-tree';
import { type ReactNode } from 'react';
import { TableVizComponent } from '~/components/plugins/viz-components/table';
import { PanelMeta, type IPanelMeta } from '~/model/meta-model/dashboard/content/panel';
import { type IPanelStyleMeta } from '~/model/meta-model/dashboard/content/panel/style';
import { type IPanelTitleMeta } from '~/model/meta-model/dashboard/content/panel/title';
import { type IVariableMeta } from '~/model/meta-model/dashboard/content/panel/variable';
import { QueryRenderModelInstance, type IQueryRenderModel } from '../queries';
import { downloadJSON } from '~/utils/download';
import {
  formatAggregatedValue,
  getAggregatedValue,
  getColorByVariableColorConf,
  ITemplateVariable,
  variablesToStrings,
} from '~/utils';
import { CURRENT_SCHEMA_VERSION, type IQueryMeta } from '~/model/meta-model';
import { typeAssert } from '~/types/utils';
import { DataSourceType } from '~/model/meta-model/dashboard/content/query/types';

export type VariableValueMap = Record<string, string | number>;
export type VariableAggValueMap = Record<string, string | number>;
export type VariableStyleMap = Record<
  string,
  { color: string; 'font-size': string; 'font-weight': string; variable: ITemplateVariable }
>;

export const PanelRenderModel = PanelMeta.views((self) => ({
  get contentModel(): any {
    // @ts-expect-error typeof getRoot
    return getRoot(self).content;
  },
}))
  .views((self) => ({
    get queries(): QueryRenderModelInstance[] {
      return self.contentModel.queries.findByIDSet(self.queryIDSet);
    },
    get firstQuery(): QueryRenderModelInstance | null {
      if (this.queries.length > 0) {
        return this.queries[0];
      }
      return null;
    },
    get firstQueryData() {
      if (this.firstQuery) {
        return this.firstQuery.data;
      }
      return [];
    },
    queryByID(queryID: string): QueryRenderModelInstance | undefined {
      return this.queries.find((q) => q.id === queryID);
    },
    get data() {
      return this.queries.reduce((ret: TPanelData, q) => {
        ret[q.id] = q.data;
        return ret;
      }, {});
    },
    get variableStrings() {
      return variablesToStrings(self.variables, this.data);
    },
    get variableAggValueMap() {
      const ret: VariableAggValueMap = {};
      const data = this.data;
      self.variables.reduce((prev, variable) => {
        prev[variable.name] = getAggregatedValue(variable, data);
        return prev;
      }, ret);
      return ret;
    },
    get variableValueMap() {
      const ret: VariableValueMap = {};
      const aggValues = this.variableAggValueMap;
      self.variables.reduce((prev, variable) => {
        prev[variable.name] = formatAggregatedValue(variable, aggValues[variable.name]);
        return prev;
      }, ret);
      return ret;
    },
    get variableStyleMap() {
      const values = this.variableValueMap;
      const ret: VariableStyleMap = {};
      self.variables.reduce((prev, variable) => {
        const color = getColorByVariableColorConf(variable.color, values[variable.name]);

        prev[variable.name] = { color, 'font-size': variable.size, 'font-weight': variable.weight, variable };
        return prev;
      }, ret);
      return ret;
    },
    get dataLoading() {
      return this.queries.some((q) => q.state === 'loading');
    },
    get queryStateMessages() {
      const queries = this.queries.filter((q) => !q.runByConditionsMet);
      if (queries.length === 0) {
        return '';
      }
      const context = new Set();
      const filters = new Set();
      queries.forEach((q) => {
        const names = q.conditionNames;
        names.context.forEach((c) => context.add(c));
        names.filters.forEach((f) => filters.add(f));
      });
      const arr = [];
      if (context.size > 0) {
        arr.push(`context: ${Array.from(context).join(', ')}`);
      }
      if (filters.size > 0) {
        arr.push(`filter${filters.size > 1 ? 's' : ''}: ${Array.from(filters).join(', ')}`);
      }
      if (arr.length === 2) {
        arr.splice(1, 0, 'and');
      }
      arr.unshift('Waiting for');
      return arr.join(' ');
    },
    get queryErrors() {
      return this.queries.map((q) => q.error ?? q.metricQueryPayloadErrorString).filter((e) => !!e);
    },
    get canRenderViz() {
      return this.queryErrors.length === 0 && this.queryStateMessages === '' && !this.dataLoading;
    },
  }))
  .actions((self) => ({
    refreshData() {
      self.queries.forEach((q) => q.fetchData(true));
    },
    downloadData() {
      self.contentModel.queries.downloadDataByQueryIDs(self.name, self.queryIDs);
    },
    getSchema() {
      const panel = self.json;
      panel.viz.conf = {
        ...panel.viz.conf,
        __INTERACTIONS: {},
        __OPERATIONS: {},
        __TRIGGERS: {},
      };

      return {
        panel,
        queries: self.queries.map((q) => q.json),
        layouts: self.contentModel.layouts.jsonByPanelIDSet(new Set([self.id])),
      };
    },
    downloadSchema() {
      const { panel, queries, layouts } = this.getSchema();
      const schema = {
        panels: [panel],
        definition: {
          queries,
        },
        layouts,
        version: CURRENT_SCHEMA_VERSION,
      };
      const schemaStr = JSON.stringify(schema, null, 2);
      const filename = self.name;
      downloadJSON(filename, schemaStr);
    },
  }));

export type PanelRenderModelInstance = Instance<typeof PanelRenderModel>;
export type PanelRenderModelSnapshotIn = SnapshotIn<PanelRenderModelInstance>;

export function getNewPanel(id: string): PanelRenderModelSnapshotIn {
  return {
    id,
    name: 'Panel',
    title: { show: true },
    description: '<p></p>',
    queryIDs: [],
    viz: {
      type: TableVizComponent.name,
      conf: TableVizComponent.createConfig(),
    },
    style: {
      border: {
        enabled: true,
      },
    },
  };
}

export interface IPanelRenderModel extends IPanelMeta {
  readonly contentModel: {
    content: {
      queries: {
        findByIDSet(ids: Set<string>): QueryRenderModelInstance[];
      };
    };
  };
  readonly queries: QueryRenderModelInstance[];
  readonly firstQuery: QueryRenderModelInstance | null;
  readonly firstQueryData: Array<string[] | number[] | Record<string, unknown>>;
  readonly data: TPanelData;
  readonly variableStrings: Record<string, ReactNode>;
  readonly variableAggValueMap: VariableAggValueMap;
  readonly variableValueMap: VariableValueMap;
  readonly variableStyleMap: VariableStyleMap;
  readonly dataLoading: boolean;
  readonly queryStateMessages: string;
  readonly queryErrors: string[];
  readonly canRenderViz: boolean;

  queryByID(queryID: string): IQueryRenderModel | undefined;
  refreshData(): void;
  downloadData(): void;
  getSchema(): {
    panel: IPanelMeta['json'];
    queries: Array<IQueryRenderModel['json']>;
    layouts: unknown;
  };
  downloadSchema(): void;
}

typeAssert.shouldExtends<IPanelRenderModel, Instance<typeof PanelRenderModel>>();

typeAssert.shouldExtends<Instance<typeof PanelRenderModel>, IPanelRenderModel>();
