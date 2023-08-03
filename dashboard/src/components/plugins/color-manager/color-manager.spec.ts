import { ISingleColor } from '~/types/plugin';
import { PluginManager } from '../plugin-manager';
import { IColorManager } from '~/components/plugins/color-manager';
import { ColorManager } from './impl';

const fooColor = {
  name: 'foo',
  type: 'single',
  category: 'basic',
  value: '#ff0000',
};

const colors: ISingleColor[] = [
  { type: 'single', category: 'basic', value: '1', name: 'foo' },
  { type: 'single', category: 'basic', value: '2', name: 'bar' },
  { type: 'single', category: 'foot', value: '3', name: 'ball1' },
  { type: 'single', category: 'football', value: '4', name: '1' },
];
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
  describe('encodeColor', () => {
    beforeEach(() => {
      colors.forEach((color) => {
        cm.register(color);
      });
    });
    test.each(colors)('%o', (color: ISingleColor) => {
      expect(cm.decodeStaticColor(cm.encodeColor(color))).toStrictEqual(color);
    });
  });
});
