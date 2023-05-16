import { getParent, getParentOfType, getRoot, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { ContentModel } from '~/model';
import { VariableModel } from '~/model/variables';
import { TableVizComponent } from '~/plugins/viz-components/table';
import { QueryModelInstance } from '../queries';
import { PanelLayoutModel } from './layout';
import { PanelStyleModel } from './style';
import { PanelVizModel } from './viz';

export const PanelModel = types
  .model({
    id: types.string,
    title: types.string,
    description: types.string,
    layout: PanelLayoutModel,
    queryID: types.string,
    viz: PanelVizModel,
    style: PanelStyleModel,
    variables: types.optional(types.array(VariableModel), []),
  })
  .views((self) => ({
    get query(): QueryModelInstance | undefined {
      return getParentOfType(self, ContentModel).queries.findByID(self.queryID) as QueryModelInstance | undefined;
    },
    get json() {
      const { id, title, description, queryID } = self;
      return {
        id,
        viz: self.viz.json,
        style: self.style.json,
        title,
        layout: self.layout.json,
        queryID: queryID,
        variables: self.variables.map((v) => v.json),
        description,
      };
    },
  }))
  .actions((self) => ({
    setID(id: string) {
      self.id = id;
    },
    setTitle(title: string) {
      self.title = title;
    },
    setDescription(description: string) {
      self.description = description;
    },
    setQueryID(queryID: string) {
      const queryInstance = getParentOfType(self, ContentModel).queries.findByID(queryID) as
        | QueryModelInstance
        | undefined;
      if (queryInstance) {
        self.queryID = queryID;
      } else {
        throw new Error(`Query with id ${queryID} does not exist`);
      }
    },
    addVariable(variable: SnapshotIn<typeof VariableModel>) {
      self.variables.push(variable);
    },
    removeVariable(variable: Instance<typeof VariableModel>) {
      self.variables.remove(variable);
    },
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

export function getNewPanel(id: string): PanelModelSnapshotIn {
  return {
    id,
    layout: {
      x: 0,
      y: Infinity, // puts it at the bottom
      w: 18,
      h: 300,
    },
    title: id,
    description: '<p></p>',
    queryID: '',
    viz: {
      type: TableVizComponent.name,
      conf: TableVizComponent.createConfig(),
    },
    style: {
      border: {
        enabled: true,
      },
    },
  };
}
