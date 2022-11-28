import { ITemplateVariable } from '~/utils/template';
import { VizCartesianMigrator } from '~/plugins/viz-components/cartesian/index';
import { JsonPluginStorage } from '~/plugins/json-plugin-storage';
import { PanelModelInstance } from '~/model/views/view/panels';
import { get } from 'lodash';

describe('migrator', () => {
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
      stats: {
        variables: [{ name: 'var2' }, { name: 'var3' }] as ITemplateVariable[],
      },
    };
    const migrator = new VizCartesianMigrator();
    const pluginStorage = new JsonPluginStorage({ version: 1, config: legacyData });
    await migrator.migrate({
      configData: pluginStorage,
      panelModel: mockPanelModel,
    });
    expect(variables).toHaveLength(3);
    expect(variables[0].name).toBe('var1');
    expect(variables[1].name).toBe('var2');
    expect(variables[2].name).toBe('var3');
    const config = await pluginStorage.getItem(null);
    expect(get(config, 'variables')).toBeUndefined();
    expect(get(config, 'variables.stats')).toBeUndefined();
  });
});
