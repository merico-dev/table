import { get } from 'lodash';
import { ITemplateVariable } from '~/utils/template';
import type { PanelModelInstance } from '~/model/views/view/panels';
import { VizBoxplotChartMigrator } from './index';
import { IBoxplotChartConf } from './type';
import { JsonPluginStorage } from '~/plugins/json-plugin-storage';

describe('VizBoxplotChartMigrator', () => {
  test('move variables', async () => {
    const variables: ITemplateVariable[] = [];
    const mockPanelModel = {
      variables,
      addVariable: (variable: ITemplateVariable) => {
        variables.push(variable);
      },
    } as unknown as PanelModelInstance;
    const legacyData = {
      variables: [{ name: 'var1' }, { name: 'var2' }] as ITemplateVariable[],
    } as IBoxplotChartConf & { variables: ITemplateVariable[] };
    const migrator = new VizBoxplotChartMigrator();
    const pluginStorage = new JsonPluginStorage({ version: 1, config: legacyData });
    await migrator.migrate({
      configData: pluginStorage,
      panelModel: mockPanelModel,
    });
    expect(variables).toHaveLength(2);
    expect(variables[0].name).toBe('var1');
    expect(variables[1].name).toBe('var2');
    const config = await pluginStorage.getItem<IBoxplotChartConf>(null);
    expect(get(config, 'variables')).toBeUndefined();
  });
});
