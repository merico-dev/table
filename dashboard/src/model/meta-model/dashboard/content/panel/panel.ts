import { cast, types, type Instance } from 'mobx-state-tree';
import { type IObservableArray } from 'mobx';
import { PanelStyleMeta, type IPanelStyleMeta } from './style';
import { PanelTitleMeta, type IPanelTitleMeta } from './title';
import { VariableMeta, VariableMetaInstance, VariableMetaSnapshotIn, type IVariableMeta } from './variable';
import { PanelVizMeta, type IPanelVizMeta } from './viz';
import { typeAssert } from '~/types/utils';

export const PanelMeta = types
  .model({
    id: types.string,
    name: types.optional(types.string, ''),
    title: PanelTitleMeta,
    description: types.string,
    queryIDs: types.array(types.string),
    viz: PanelVizMeta,
    style: PanelStyleMeta,
    variables: types.optional(types.array(VariableMeta), []),
  })
  .views((self) => ({
    get json() {
      const { id, name, title, description, queryIDs } = self;
      return {
        id,
        viz: self.viz.json,
        name,
        style: self.style.json,
        title: title.json,
        queryIDs: [...queryIDs],
        variables: self.variables.map((v) => v.json),
        description,
      };
    },
    get queryIDSet() {
      return new Set(self.queryIDs);
    },
  }))
  .actions((self) => ({
    setID(id: string) {
      self.id = id;
    },
    setName(name: string) {
      self.name = name;
    },
    setDescription(description: string) {
      self.description = description;
    },
    addQueryID(queryID: string) {
      if (self.queryIDSet.has(queryID)) {
        return;
      }
      self.queryIDs.push(queryID);
    },
    removeQueryID(queryID: string) {
      if (!self.queryIDSet.has(queryID)) {
        return;
      }
      const s = new Set(self.queryIDSet);
      s.delete(queryID);
      self.queryIDs = cast(Array.from(s));
    },
    setQueryIDs(queryIDs: string[]) {
      self.queryIDs = cast(queryIDs);
    },
    addVariable(variable: VariableMetaSnapshotIn) {
      self.variables.push(variable);
    },
    removeVariable(variable: VariableMetaInstance) {
      self.variables.remove(variable);
    },
  }));

export interface IPanelMeta {
  id: string;
  name: string;
  title: IPanelTitleMeta;
  description: string;
  queryIDs: IObservableArray<string>;
  viz: IPanelVizMeta;
  style: IPanelStyleMeta;
  variables: IObservableArray<IVariableMeta>;

  readonly json: {
    id: string;
    viz: IPanelVizMeta['json'];
    name: string;
    style: IPanelStyleMeta['json'];
    title: IPanelTitleMeta['json'];
    queryIDs: string[];
    variables: Array<IVariableMeta['json']>;
    description: string;
  };
  readonly queryIDSet: Set<string>;

  setID(id: string): void;
  setName(name: string): void;
  setDescription(description: string): void;
  addQueryID(queryID: string): void;
  removeQueryID(queryID: string): void;
  setQueryIDs(queryIDs: string[]): void;
  addVariable(variable: VariableMetaSnapshotIn): void;
  removeVariable(variable: VariableMetaInstance): void;
}

typeAssert.shouldExtends<IPanelMeta, Instance<typeof PanelMeta>>();

typeAssert.shouldExtends<Instance<typeof PanelMeta>, IPanelMeta>();
