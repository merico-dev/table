import { useCreation } from 'ahooks';
import { cloneDeep, isEmpty, last } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { usePanelContext } from '~/contexts';
import { PanelModelInstance } from '~/dashboard-editor/model/panels';
import { VariableMetaInstance, VariableMetaSnapshotIn } from '~/model';

export const NEW_VAR = {
  name: 'new_var',
  size: '1rem',
  weight: 'initial',
  color: {
    type: 'static',
    staticColor: 'Red',
  },
  data_field: '',
  aggregation: {
    type: 'sum',
    config: {},
  },
  formatter: {
    output: 'number',
    mantissa: 0,
    trimMantissa: false,
    average: false,
  },
} as VariableMetaSnapshotIn;

export class VariableConfigUIModel {
  panel: PanelModelInstance;
  selected?: VariableMetaInstance;

  constructor(panel: PanelModelInstance) {
    this.panel = panel;
    makeAutoObservable(this, {}, { deep: false, autoBind: true });
  }

  get variables() {
    return this.panel.variables;
  }

  addNew() {
    const newVarCount = this.panel.variables.filter((it) => it.name.startsWith(NEW_VAR.name)).length;
    this.panel.addVariable(cloneDeep({ ...NEW_VAR, name: `${NEW_VAR.name}${newVarCount || ''}` }));
    this.selected = last(this.panel.variables);
  }

  select(variable: VariableMetaInstance) {
    this.selected = variable;
  }

  remove(variable: VariableMetaInstance) {
    if (this.selected === variable) {
      this.selected = undefined;
    }
    const currentIndex = this.panel.variables.indexOf(variable);
    this.panel.removeVariable(variable);
    if (!this.selected && !isEmpty(this.panel.variables)) {
      const focusIndex = Math.min(this.panel.variables.length - 1, currentIndex);
      this.selected = this.panel.variables[focusIndex];
    }
  }
}

export function useConfigUIModel() {
  const { panel } = usePanelContext();
  return useCreation(() => new VariableConfigUIModel(panel), [panel]);
}
