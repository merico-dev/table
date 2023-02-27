import { getParent, getParentOfType, Instance, SnapshotIn, types } from 'mobx-state-tree';
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
  }));

export type PanelModelInstance = Instance<typeof PanelModel>;
