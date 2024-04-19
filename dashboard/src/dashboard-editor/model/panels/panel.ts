import { getParent, getRoot, Instance, SnapshotIn } from 'mobx-state-tree';
import { PanelRenderModel } from '~/model';
import { parseDataKey } from '~/utils';

export const PanelModel = PanelRenderModel.views((self) => ({
  get realDataFieldOptions() {
    if (self.queryIDs.length === 0) {
      return [];
    }

    return self.queries
      .map((query) => {
        const queryData = query.data;
        if (queryData.length === 0) {
          return [];
        }
        const keys = Object.keys(queryData[0]);
        return keys.map((k) => ({
          label: k,
          value: `${query.id}.${k}`,
          group: query.name,
          disabled: false,
        }));
      })
      .flat();
  },

  dataFieldOptions(selected: TDataKey, clearable: boolean, queryID?: string) {
    let options = [...this.realDataFieldOptions];
    if (queryID) {
      options = options.filter((o) => o.group === queryID);
    }
    if (selected && !options.find((o) => o.value === selected)) {
      const s = parseDataKey(selected);
      const q = self.queryByID(s.queryID);
      options.unshift({
        label: s.columnKey,
        value: selected,
        group: q ? q.name : s.queryID,
        disabled: true,
      });
    }

    if (clearable) {
      options.unshift({ label: 'unset', value: '', group: '', disabled: false });
    }
    return options;
  },
  explainDataKey(dataKey: TDataKey) {
    const { queryID, columnKey } = parseDataKey(dataKey);
    const q = self.queries.find((q) => q.id === queryID);
    if (!q) {
      return { queryID, queryName: null, columnKey };
    }
    return { queryID, queryName: q.name, columnKey };
  },
}))
  .actions((self) => ({
    removeSelf() {
      const parent = getParent(self, 2) as any;
      parent.removeByID(self.id);
    },
  }))
  .actions((self) => ({
    moveToView(sourceViewID: string, targetViewID: string) {
      // @ts-expect-error getRoot type
      const sourceView = getRoot(self).content.views.findByID(sourceViewID);
      sourceView.removePanelID(self.id);

      // @ts-expect-error getRoot type
      const targetView = getRoot(self).content.views.findByID(targetViewID);
      targetView.appendPanelID(self.id);

      // @ts-expect-error getRoot type
      const editor = getRoot(self).editor;
      editor.setPath(['_VIEWS_', targetViewID, '_PANELS_', self.id]);
    },
  }));

export type PanelModelInstance = Instance<typeof PanelModel>;
export type PanelModelSnapshotIn = SnapshotIn<PanelModelInstance>;
