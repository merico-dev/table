import { autorun, reaction } from 'mobx';
import { SnapshotIn, addDisposer, applySnapshot, cast, flow, toGenerator, types } from 'mobx-state-tree';
import { APICaller } from '../../../api-caller';
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
        const { data } = yield* toGenerator(APICaller.dashboard.list());
        if (!Array.isArray(data)) {
          throw new Error('no dashboard found');
        }
        self.setList(data);
        self.setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }),
    setCurrentDetail(detail: SnapshotIn<typeof DashboardDetailModel>) {
      if (!self.currentDetail) {
        self.currentDetail = DashboardDetailModel.create(detail);
        return;
      }
      applySnapshot(self.currentDetail, detail);
    },
    loadCurrentDetail: flow(function* () {
      self.setDetailLoading(true);
      try {
        const data = yield* toGenerator(APICaller.dashboard.details(self.currentID));
        if (!('content_id' in data)) {
          throw new Error('failed to load dashboard detail');
        }
        self.currentDetail = DashboardDetailModel.create({
          ...data,
          content: {
            id: data.content_id,
            data: {},
          },
        });
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
