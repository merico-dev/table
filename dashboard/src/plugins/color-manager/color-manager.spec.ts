import { PluginManager } from '../plugin-manager';
import { IColorManager } from './color-manager';
import { ColorManager } from './impl';

const fooColor = {
  name: 'foo',
  type: 'single',
  category: 'basic',
  value: '#ff0000',
};
describe('ColorManager', () => {
  let cm: IColorManager;
  beforeEach(() => {
    cm = new ColorManager(new PluginManager());
  });
  test('register single color', () => {
    cm.register(fooColor);
    expect(cm.getStaticColors()).toHaveLength(1);
    expect(cm.getStaticColors()).toMatchInlineSnapshot(`
      [
        {
          "category": "basic",
          "name": "foo",
          "type": "single",
          "value": "#ff0000",
        },
      ]
    `);
  });
  test('register duplicated single color', () => {
    cm.register(fooColor);
    cm.register({ ...fooColor, value: '2333' });
    expect(cm.getStaticColors()).toHaveLength(1);
    expect(cm.getStaticColors()[0].value).toBe('2333');
  });
});
