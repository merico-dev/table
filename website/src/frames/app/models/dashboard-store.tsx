import { useCreation, useRequest } from 'ahooks';
import { autorun } from 'mobx';
import { addDisposer, cast, flow, getSnapshot, Instance, SnapshotIn, toGenerator, types } from 'mobx-state-tree';
import { useEffect } from 'react';
import { DashboardAPI } from '../../../api-caller/dashboard';
import { normalizeDBDashboard } from '../../../api-caller/dashboard.transform';

export const DashboardDetailModel = types
  .model('DashboardListItem', {
    id: types.identifier,
    name: types.string,
    group: types.string,
    is_preset: types.maybe(types.boolean),
    content: types.frozen<Record<string, $TSFixMe>>(),
    // for simplicity, use string for the date time type for now
    create_time: types.string,
    update_time: types.string,
    is_removed: types.boolean,
  })
  .views((self) => ({
    get isEditable() {
      return !self.is_preset;
    },
    get dashboard() {
      return normalizeDBDashboard(getSnapshot(self));
    },
  }));

export type DashboardDetailModelInstance = Instance<typeof DashboardDetailModel>;

const DashboardDetailQuery = types
  .model('DashboardDetailQuery', {
    data: types.maybe(DashboardDetailModel),
  })
  .actions((self) => ({
    setState(data?: SnapshotIn<typeof DashboardDetailModel>) {
      self.data = cast(data);
    },
  }));

export const useDashboardDetailQuery = ({ id }: { id: string }) => {
  const model = useCreation(() => DashboardDetailQuery.create(), []);
  const { data, loading, refresh } = useRequest(
    async () => {
      return await DashboardAPI.details(id);
    },
    {
      refreshDeps: [id],
    },
  );
  useEffect(() => {
    model.setState(data);
  }, [data, loading]);
  return { data: model.data, refresh, loading };
};

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
