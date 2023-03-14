import { getParent, getParentOfType, getRoot, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { QueryModelInstance } from '../../../queries';
import { PanelLayoutModel } from './layout';
import { PanelStyleModel } from './style';
import { PanelVizModel } from './viz';
import { DashboardModel } from '~/model';
import { VariableModel } from '~/model/variables';

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
      return getParentOfType(self, DashboardModel).queries.findByID(self.queryID) as QueryModelInstance | undefined;
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
    get viewID() {
      // @ts-expect-error getParent type
      return getParent(self, 3).id;
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
      const queryInstance = getParentOfType(self, DashboardModel).queries.findByID(queryID) as
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
    moveToView(targetViewID: string) {
      const newID = new Date().getTime().toString();
      const newPanel = {
        ...self.json,
        id: newID,
      };
      // @ts-expect-error getRoot type
      const view = getRoot(self).views.findByID(targetViewID);
      view.panels.append(newPanel);

      // @ts-expect-error getRoot type
      const editor = getRoot(self).editor;
      editor.setPath(['_VIEWS_', targetViewID, '_PANELS_', newID]);

      self.removeSelf();
    },
  }));

export type PanelModelInstance = Instance<typeof PanelModel>;
