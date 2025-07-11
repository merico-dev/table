import _ from 'lodash';
import { getParent, getRoot, Instance, SnapshotIn } from 'mobx-state-tree';
import { PanelRenderModel } from '~/model';
import { parseDataKey } from '~/utils';

export const PanelModel = PanelRenderModel.views((self) => ({
  get realQueryOptions() {
    if (self.queryIDs.length === 0) {
      return [];
    }

    return self.queries.map((query) => ({
      label: query.name,
      value: query.id,
      disabled: false,
    }));
  },

  queryOptions(selected: string, clearable: boolean) {
    const options = [...this.realQueryOptions];
    if (selected && !options.find((o) => o.value === selected)) {
      options.unshift({
        label: selected,
        value: selected,
        disabled: true,
      });
    }

    if (clearable) {
      options.unshift({ label: 'unset', value: '', disabled: false });
    }
    return options;
  },
  get realVariableOptions() {
    const varMap = self.variableValueMap;
    return Object.entries(self.variableAggValueMap).map(([k, aggValue]) => {
      return {
        label: k,
        value: k,
        formattedValue: varMap[k],
        aggValue: aggValue,
        disabled: false,
      };
    });
  },
  variableOptions(selected: string, clearable: boolean) {
    const options = [...this.realVariableOptions];
    if (selected && !options.find((o) => o.value === selected)) {
      options.unshift({
        label: selected,
        value: selected,
        formattedValue: '',
        aggValue: '',
        disabled: true,
      });
    }

    if (clearable) {
      options.unshift({ label: 'unset', value: '', formattedValue: '', aggValue: '', disabled: false });
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
