import { Cell } from '@tanstack/react-table';
import { get, isString } from 'lodash';
import { MultiStepValueMapper } from '~/plugins/color-manager/multi-step-value-mapper';
import { ClickCellContent } from '~/plugins/viz-components/table/triggers/click-cell-content';
import { AnyObject } from '~/types';
import { ITriggerSnapshot, IVizInteractionManager } from '~/types/plugin';
import { IColorManager } from '../..';
import { IColumnConf, ITableCellContext, TriggerConfigType } from './type';

export class TableCellContext implements ITableCellContext {
  constructor(
    private getColIndex: (cell: Cell<AnyObject, unknown>) => number,
    public cell: Cell<AnyObject, unknown>,
    public triggers: ITriggerSnapshot<TriggerConfigType>[],
    public interactionManager: IVizInteractionManager,
    public colorManager: IColorManager,
  ) {}

  getClickHandler(): (() => void) | undefined {
    const relatedTriggers = this.getRelatedTrigger();
    if (relatedTriggers.length === 0) {
      return undefined;
    }
    return () => {
      const payload = {
        row_data: this.cell.row.original,
        row_index: this.cell.row.index,
        col_index: this.getColIndex(this.cell),
      };
      for (const trigger of relatedTriggers) {
        void this.interactionManager.runInteraction(trigger.id, payload);
      }
    };
  }

  private getRelatedTrigger() {
    const clickCellTriggers = this.triggers.filter((it) => it.schemaRef === ClickCellContent.id);
    return clickCellTriggers.filter((it) => {
      // -1 for index column
      const colIndex = this.getColIndex(this.cell);
      const colField = get(this.cell.column.columnDef.meta, 'value_field');
      const column = get(it.config, 'column');
      return column == colIndex || column == colField;
    });
  }

  isClickable(): boolean {
    return this.getRelatedTrigger().length > 0;
  }

  get columnConf(): IColumnConf {
    return this.cell.column.columnDef.meta as IColumnConf;
  }

  get bgColor() {
    const colorDef = this.columnConf.cellBackgroundColor;
    if (!colorDef || colorDef === 'none') {
      return undefined;
    }
    if (isString(colorDef)) {
      return colorDef;
    }
    const cellValueNumber = +(this.cell.getValue() as number);
    if (isFinite(cellValueNumber)) {
      const interpolation = this.colorManager.decodeInterpolation(colorDef.interpolation);
      const valueMapper = new MultiStepValueMapper(colorDef.steps);
      const mappedValue = valueMapper.mapValue(cellValueNumber);
      return interpolation?.getColor(mappedValue);
    }
  }
}
