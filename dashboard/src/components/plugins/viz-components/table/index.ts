import { cloneDeep } from 'lodash';
import { VizComponent } from '~/types/plugin';
import { VizTableMigrator } from './migrators';
import { VizTable } from './render';
import { translation } from './translation';
import { ClickCellContent } from './triggers';
import { DEFAULT_CONFIG, ITableConf } from './type';
import { VizTableEditor } from './viz-table-editor';

const migrator = new VizTableMigrator();

export const TableVizComponent: VizComponent = {
  createConfig() {
    return {
      version: migrator.VERSION,
      config: cloneDeep(DEFAULT_CONFIG) as ITableConf,
    };
  },
  displayName: 'viz.table.viz_name',
  displayGroup: 'chart.groups.others',
  migrator,
  name: 'table',
  viewRender: VizTable,
  configRender: VizTableEditor,
  triggers: [ClickCellContent],
  translation,
};
