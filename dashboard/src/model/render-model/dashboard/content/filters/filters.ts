import _ from 'lodash';
import { Instance, getParent, getRoot, types } from 'mobx-state-tree';
import { type IObservableArray } from 'mobx';
import {
  CURRENT_SCHEMA_VERSION,
  ContextRecordType,
  FilterMeta,
  FilterMetaSnapshotOut,
  FilterValuesType,
  type DashboardFilterType,
  type IFilterMeta,
} from '~/model';
import { downloadJSON } from '~/utils/download';
import { getValuesFromFilters, formatInputFilterValues } from './utils';
import { typeAssert } from '~/types/utils';
import type { TSelectOption } from '~/model/meta-model/dashboard/content/filter/widgets/select-base';
import { IContentRenderModel } from '~/dashboard-render';
import { FilterModelSnapshotOut } from '~/dashboard-editor';

export const FiltersRenderModel = types
  .model('FiltersRenderModel', {
    current: types.optional(types.array(FilterMeta), []),
    values: types.optional(types.frozen(), {}),
  })
  .views((self) => ({
    get json() {
      return self.current.map((f) => f.json);
    },
    get valuesString() {
      return JSON.stringify(self.values);
    },
    get filter(): any {
      return getParent(self);
    },
    get keysToTypes() {
      return self.current.reduce((acc, curr) => {
        acc[curr.key] = curr.type;
        return acc;
      }, {} as Record<string, DashboardFilterType>);
    },
    get valuesForPayload() {
      const ret: Record<string, any> = {};
      Object.entries(self.values).forEach(([k, v]) => {
        ret[k] = v;
        const f = this.findByKey(k);
        if (f && f.config._name === 'date-range') {
          ret[k] = f.config.dateStringsValue;
        }
      });
      return ret;
    },
    get contentModel(): any {
      // @ts-expect-error typeof getRoot
      return getRoot(self).content;
    },
    get context() {
      return this.contentModel.payloadForSQL.context;
    },
    get initialValuesDep() {
      return JSON.stringify({
        filters: self.current.map(({ default_value_func, config }) => ({ default_value_func, config })),
        context: this.contentModel.payloadForSQL.context,
      });
    },
    get formattedDefaultValues() {
      return getValuesFromFilters(this.json, this.contentModel.context);
    },
    get firstID() {
      if (self.current.length === 0) {
        return undefined;
      }
      return self.current[0].id;
    },
    findByID(id: string) {
      return self.current.find((f) => f.id === id);
    },
    findByKey(key: string) {
      return self.current.find((f) => f.key === key);
    },
    findByIDSet(idset: Set<string>) {
      return self.current.filter((f) => idset.has(f.id));
    },
    get inOrder() {
      return _.sortBy(self.current, 'order');
    },
    get empty() {
      return self.current.length === 0;
    },
    visibleInView(viewID: string) {
      return _.sortBy(
        self.current.filter((f) => f.visibleInViewsIDSet.has(viewID)),
        'order',
      );
    },
    get firstFilterValueKey() {
      return Object.keys(self.values)[0] ?? '';
    },
    get keySet() {
      return new Set(self.current.map((o) => o.key));
    },
    get keyLabelMap() {
      return self.current.reduce((ret, f) => {
        ret[f.key] = f.label;
        return ret;
      }, {} as Record<string, string>);
    },
    getSelectOption(id: string) {
      const filter = this.findByID(id) as IFilterMeta | undefined;
      if (!filter || !('getSelectOption' in filter.config)) {
        return null;
      }

      const value = self.values[filter.key];
      return filter.config.getSelectOption(value);
    },
  }))
  .actions((self) => ({
    setValues(values: Record<string, $TSFixMe>) {
      console.debug('⚪️ setting filter values: ', JSON.stringify(values));
      self.values = values;
    },
    patchValues(values: FilterValuesType) {
      console.debug('⚪️ patching filter values: ', JSON.stringify(values));
      self.values = formatInputFilterValues(values, self.values);
    },
    setValueByKey(key: string, value: $TSFixMe) {
      console.debug(`⚪️ setting filter[${key}] to value: `, JSON.stringify(value));
      self.values = {
        ...self.values,
        [key]: value,
      };
    },
    applyValuesPatch(values: Record<string, any>) {
      self.values = {
        ...self.values,
        ...values,
      };
    },
    getValueByKey(key: string) {
      return self.values[key];
    },

    getSchema(
      ids: string[],
      raw?: boolean,
    ): {
      filters: IFilterSchemaItem[];
      version: string;
    } {
      const filters = self.findByIDSet(new Set(ids));

      const ret = {
        filters: filters.map((f) => ({
          ...f.json,
          visibleInViewsIDs: raw ? f.json.visibleInViewsIDs : ([] as string[]),
        })),
        version: CURRENT_SCHEMA_VERSION,
      };
      return ret;
    },
    downloadSchema(ids: string[]) {
      const schema = JSON.stringify(this.getSchema(ids, false), null, 2);
      const filename = 'Filters';
      downloadJSON(filename, schema);
    },
  }));
export type FiltersRenderModelInstance = Instance<typeof FiltersRenderModel>;

export function getInitialFiltersConfig(
  filters: FilterModelSnapshotOut[],
  context: ContextRecordType,
  mock_context: ContextRecordType,
  filterValues: Record<string, any>,
) {
  const ctx = { ...mock_context, ...context };
  const defaultValues = getValuesFromFilters(filters, ctx);
  const initialValues = formatInputFilterValues(filterValues, defaultValues);
  return {
    current: filters,
    values: initialValues,
  };
}

export interface IFilterJsonType {
  id: string;
  key: string;
  type: DashboardFilterType;
  label: string;
  order: number;
  config: Record<string, unknown>;
  auto_submit: boolean;
  visibleInViewsIDs: IObservableArray<string>;
  default_value_func: string;
}

export interface IFilterSchemaItem extends Omit<IFilterJsonType, 'visibleInViewsIDs'> {
  visibleInViewsIDs: string[];
}

export interface IFiltersRenderModel {
  // Properties
  current: IObservableArray<IFilterMeta>;
  values: Record<string, unknown>;

  // Views
  readonly json: IFilterJsonType[];
  readonly valuesString: string;
  readonly filter: unknown;
  readonly keysToTypes: Record<string, DashboardFilterType>;
  readonly valuesForPayload: Record<string, unknown>;
  readonly contentModel: IContentRenderModel;
  readonly context: ContextRecordType;
  readonly initialValuesDep: string;
  readonly formattedDefaultValues: Record<string, unknown>;
  readonly firstID: string | undefined;
  readonly keySet: Set<string>;
  readonly keyLabelMap: Record<string, string>;
  readonly empty: boolean;

  // Methods
  findByID(id: string): IFilterMeta | undefined;
  findByKey(key: string): IFilterMeta | undefined;
  findByIDSet(idset: Set<string>): IFilterMeta[];
  readonly inOrder: IFilterMeta[];
  visibleInView(viewID: string): IFilterMeta[];
  readonly firstFilterValueKey: string;
  getSelectOption(id: string): TSelectOption | null | undefined;

  // ActionvisibleInViewsIDss
  setValues(values: Record<string, unknown>): void;
  patchValues(values: FilterValuesType): void;
  setValueByKey(key: string, value: unknown): void;
  applyValuesPatch(values: Record<string, unknown>): void;
  getValueByKey(key: string): unknown;
  getSchema(
    ids: string[],
    raw?: boolean,
  ): {
    filters: IFilterSchemaItem[];
    version: string;
  };
  downloadSchema(ids: string[]): void;
}

typeAssert.shouldExtends<IFiltersRenderModel, FiltersRenderModelInstance>();
typeAssert.shouldExtends<FiltersRenderModelInstance, IFiltersRenderModel>();
