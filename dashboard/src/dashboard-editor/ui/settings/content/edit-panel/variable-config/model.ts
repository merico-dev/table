import { useCreation } from 'ahooks';
import { cloneDeep, isEmpty, last } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { useEditPanelContext } from '~/contexts';
import { PanelModelInstance } from '~/dashboard-editor/model/panels';
import { VariableMetaInstance, VariableMetaSnapshotIn } from '~/model';

export const NEW_VAR: VariableMetaSnapshotIn = {
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
    fallback: '0',
  },
  formatter: {
    output: 'number',
    mantissa: 0,
    trimMantissa: false,
    average: false,
  },
};

export class VariableConfigUIModel {
  panel: PanelModelInstance;
  selected?: VariableMetaInstance;

  constructor(panel: PanelModelInstance) {
    this.panel = panel;
    if (panel.variables.length > 0) {
      this.selected = panel.variables[0];
    }
    makeAutoObservable(this, {}, { deep: false, autoBind: true });
  }

  get variables() {
    return this.panel.variables;
  }

  get variableOptions() {
    return this.panel.variables.map((v) => ({
      label: v.name,
      value: v.name,
      description: v.aggregation.type,
    }));
  }

  addNew() {
    const newVarCount = this.panel.variables.filter((it) => it.name.startsWith(NEW_VAR.name)).length;
    this.panel.addVariable(cloneDeep({ ...NEW_VAR, name: `${NEW_VAR.name}${newVarCount || ''}` }));
    this.selected = last(this.panel.variables);
  }

  select(variable: VariableMetaInstance) {
    this.selected = variable;
  }

  selectByName(name: string | null) {
    if (!name) {
      console.warn('Unexpected null name when calling selectByName');
      return;
    }

    const v = this.variables.find((v) => v.name === name);
    if (!v) {
      console.error(`Variable by name[${name}] not found`);
      return;
    }

    this.selected = v;
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
  const { panel } = useEditPanelContext();
  return useCreation(() => new VariableConfigUIModel(panel), [panel]);
}
