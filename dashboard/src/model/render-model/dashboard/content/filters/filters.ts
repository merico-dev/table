import _ from 'lodash';
import { Instance, getParent, getRoot, types } from 'mobx-state-tree';
import {
  CURRENT_SCHEMA_VERSION,
  ContextRecordType,
  FilterMeta,
  FilterMetaSnapshotOut,
  FilterValuesType,
} from '~/model';
import { downloadJSON } from '~/utils/download';
import { getValuesFromFilters, formatInputFilterValues } from './utils';

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
      const filter = this.findByID(id);
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

    getSchema(ids: string[], raw?: boolean) {
      const filters = self.findByIDSet(new Set(ids));

      const ret = {
        filters: filters.map((f) => ({ ...f.json, visibleInViewsIDs: raw ? f.json.visibleInViewsIDs : [] })),
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
  filters: FilterMetaSnapshotOut[],
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
