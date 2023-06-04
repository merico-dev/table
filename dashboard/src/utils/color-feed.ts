import { ChartTheme } from '~/styles/register-themes';
export function* getColorFeed(paletteKey: keyof typeof ChartTheme.graphics): Generator<string, string> {
  const theme = ChartTheme.graphics[paletteKey];
  if (!theme) {
    throw new Error('Invalid palette key provided');
  }

  const palette = Object.values(theme);

  let i = 0;
  while (true) {
    yield palette[i % palette.length];
    i++;
  }
}
