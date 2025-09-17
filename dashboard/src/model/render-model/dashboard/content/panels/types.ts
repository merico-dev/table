import type { IObservableArray } from 'mobx';
import type { ReactNode } from 'react';
import { IContentRenderModel } from '../../../../../dashboard-render';
import type { IPanelMeta } from '../../../../meta-model';
import { type IQueryRenderModel, QueryRenderModelInstance } from '../queries';
import { VariableAggValueMap, VariableStyleMap, VariableValueMap } from './panel';
import { ComboboxItem } from '@mantine/core';

export interface IPanelRenderModel extends IPanelMeta {
  readonly contentModel: IContentRenderModel;
  readonly queries: QueryRenderModelInstance[];
  readonly firstQuery: QueryRenderModelInstance | null;
  readonly firstQueryData: Array<string[] | number[] | Record<string, unknown>>;
  readonly usingGhostViz: boolean;
  readonly data: TPanelData;
  readonly variableStrings: Record<string, ReactNode>;
  readonly variableAggValueMap: VariableAggValueMap;
  readonly variableValueMap: VariableValueMap;
  readonly variableStyleMap: VariableStyleMap;
  readonly dataLoading: boolean;
  readonly queryStateMessages: string;
  readonly queryErrors: string[];
  readonly canRenderViz: boolean;
  readonly realDataFieldOptions: { label: string; value: string; group: string; group_id: string; disabled: boolean }[];

  queryByID(queryID: string): IQueryRenderModel | undefined;

  refreshData(): void;

  downloadData(): void;

  getSchema(): {
    panel: IPanelMeta['json'];
    queries: Array<IQueryRenderModel['json']>;
    layouts: unknown;
  };

  downloadSchema(): void;
  dataFieldOptions(props: {
    selected: TDataKey;
    clearable: boolean;
    unsetKey: string;
    queryID?: string;
    additional_options?: ComboboxItem[];
  }): { label: string; value: string; group: string; group_id: string; disabled: boolean }[];
  dataFieldOptionGroups(props: {
    selected: TDataKey;
    clearable: boolean;
    unsetKey: string;
    queryID?: string;
    additional_options?: ComboboxItem[];
  }): { group: string; items: { label: string; value: string; group_id: string; disabled: boolean }[] }[];
}

export interface IPanelsRenderModel {
  list: IObservableArray<IPanelRenderModel>;
  readonly json: IPanelRenderModel['json'][];

  findByID<T = IPanelRenderModel>(id: string): T | undefined;

  readonly idMap: Map<string, IPanelRenderModel>;

  panelsByIDs(ids: string[]): IPanelRenderModel[];
}
