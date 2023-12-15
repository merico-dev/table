import _ from 'lodash';
import { cast, detach, Instance } from 'mobx-state-tree';
import { DataSourceType, QueriesRenderModel, QueryRenderModelInstance } from '~/model';

export const QueriesModel = QueriesRenderModel.views((self) => ({
  get options() {
    const options = self.current.map(
      (d) =>
        ({
          value: d.id,
          label: d.name,
          _type: 'query',
        } as const),
    );
    return _.sortBy(options, (o) => o.label.toLowerCase());
  },
  get optionsWithoutTransform() {
    const options = self.current
      .filter((q) => q.type !== DataSourceType.Transform)
      .map(
        (d) =>
          ({
            value: d.id,
            label: d.name,
            _type: 'query',
          } as const),
      );
    return _.sortBy(options, (o) => o.label.toLowerCase());
  },
  get sortedList() {
    return _.sortBy(self.current, (o) => o.name.toLowerCase());
  },
})).actions((self) => ({
  replace(current: Array<QueryRenderModelInstance>) {
    self.current = cast(current);
  },
  append(item: QueryRenderModelInstance) {
    self.current.push(item);
  },
  appendMultiple(items: QueryRenderModelInstance[]) {
    if (items.length === 0) {
      return;
    }

    const newItems = items.filter((item) => !self.idSet.has(item.id));
    self.current.push(...newItems);
  },
  remove(index: number) {
    self.current.splice(index, 1);
  },
  replaceByIndex(index: number, replacement: QueryRenderModelInstance) {
    self.current.splice(index, 1, replacement);
  },
  removeQuery(queryID: string) {
    const query = self.current.find((q) => q.id === queryID);
    if (query) {
      detach(query);
      self.current.remove(query);
    }
  },
  removeQueries(queryIDs: string[]) {
    const set = new Set(queryIDs);
    self.current.forEach((q) => {
      if (set.has(q.id)) {
        detach(q);
      }
    });
    const list = [...self.current];
    _.remove(list, (q) => set.has(q.id));
    self.current = cast(list);
  },
}));

export type QueriesModelInstance = Instance<typeof QueriesModel>;
