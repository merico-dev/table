import { autorun, reaction } from 'mobx';
import { addDisposer, cast, flow, SnapshotIn, toGenerator, types } from 'mobx-state-tree';
import { DashboardAPI } from '../../../api-caller/dashboard';
import { DashboardBriefModel, DashboardBriefModelInstance } from './dashboard-brief-model';
import { DashboardDetailModel } from './dashboard-detail-model';

export const DashboardStore = types
  .model('DashboardStore', {
    list: types.array(DashboardBriefModel),
    currentID: types.optional(types.string, ''),
    currentDetail: types.maybe(DashboardDetailModel),
    loading: types.boolean,
    detailsLoading: types.boolean,
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
        }, {} as Record<string, DashboardBriefModelInstance[]>);
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
    setList(list: SnapshotIn<typeof DashboardBriefModel>[]) {
      self.list = cast(list);
    },
    setLoading(loading: boolean) {
      self.loading = loading;
    },
    setDetailLoading(loading: boolean) {
      self.detailsLoading = loading;
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
    loadCurrentDetail: flow(function* () {
      self.setDetailLoading(true);
      try {
        const data = yield* toGenerator(DashboardAPI.details(self.currentID));
        if (!('content' in data)) {
          throw new Error('not found');
        }
        self.currentDetail = DashboardDetailModel.create(data);
        self.setDetailLoading(false);
      } catch (error) {
        console.error(error);
      }
    }),
  }))
  .actions((self) => ({
    afterCreate() {
      addDisposer(self, autorun(self.load));
      addDisposer(
        self,
        reaction(() => self.currentID, self.loadCurrentDetail),
      );
    },
  }));
