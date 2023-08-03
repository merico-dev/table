import _ from 'lodash';
import { cast, detach, Instance } from 'mobx-state-tree';
import { QueriesRenderModel, QueryRenderModelInstance } from '~/model';

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
})).actions((self) => ({
  replace(current: Array<QueryRenderModelInstance>) {
    self.current = cast(current);
  },
  append(item: QueryRenderModelInstance) {
    self.current.push(item);
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
}));

export type QueriesModelInstance = Instance<typeof QueriesModel>;
