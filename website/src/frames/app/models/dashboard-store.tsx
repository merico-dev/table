import { autorun } from 'mobx';
import { addDisposer, cast, flow, SnapshotIn, toGenerator, types } from 'mobx-state-tree';
import { DashboardAPI } from '../../../api-caller/dashboard';
import { DashboardDetailModel, DashboardDetailModelInstance } from './dashboard-detail-model';

export const DashboardStore = types
  .model('DashboardStore', {
    list: types.array(DashboardDetailModel),
    currentID: types.optional(types.string, ''),
    loading: types.boolean,
  })
  .views((self) => ({
    get current() {
      return self.list.find((b) => b.id === self.currentID);
    },
  }))
  .views((self) => ({
    getByID(id: string) {
      return self.list.find((d) => d.id === id);
    },
    get groupedList() {
      return self.list
        .filter((d) => d.group)
        .reduce((ret, d) => {
          if (!ret[d.group]) {
            ret[d.group] = [];
          }
          ret[d.group].push(d);
          return ret;
        }, {} as Record<string, DashboardDetailModelInstance[]>);
    },
    get strayList() {
      return self.list.filter((d) => !d.group);
    },
    get currentGroup() {
      if (!self.current) {
        return '';
      }
      return self.current.group;
    },
  }))
  .actions((self) => ({
    setList(list: SnapshotIn<typeof DashboardDetailModel>[]) {
      self.list = cast(list);
    },
    setLoading(loading: boolean) {
      self.loading = loading;
    },
    setCurrentID(id?: string) {
      self.currentID = id ?? '';
    },
  }))
  .actions((self) => ({
    load: flow(function* () {
      self.setLoading(true);
      try {
        const { data } = yield* toGenerator(DashboardAPI.list());
        if (!Array.isArray(data)) {
          throw new Error('not found');
        }
        self.setList(data);
        self.setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }),
  }))
  .actions((self) => ({
    afterCreate() {
      addDisposer(self, autorun(self.load));
    },
  }));
