import { IColorPaletteItem, IPluginManager, ISingleColor } from '~/types/plugin';
import { IColorManager } from '~/plugins/color-manager';

export class ColorManager implements IColorManager {
  protected staticColors = new Map<string, ISingleColor>();

  constructor(pluginManager: IPluginManager) {
    pluginManager.installedPlugins.forEach((plugin) => {
      plugin.manifest.color.forEach((color) => {
        this.register(color);
      });
    });
  }

  getStaticColors(): ISingleColor[] {
    return Array.from(this.staticColors.values());
  }

  register<T extends IColorPaletteItem>(paletteItem: T): void {
    const key = this.encodeColor(paletteItem);
    if (paletteItem.type === 'single') {
      if (this.staticColors.has(key)) {
        console.warn(
          `the color '${paletteItem.name}' has been registered under '${paletteItem.category}', previous registered value will be overridden`,
        );
      }
      this.staticColors.set(key, paletteItem as unknown as ISingleColor);
    }
  }

  decodeStaticColor(key: string): ISingleColor | undefined {
    return this.staticColors.get(key);
  }

  encodeColor(color: IColorPaletteItem): string {
    return `\${${color.category}}.{${color.name}}`;
  }
}
