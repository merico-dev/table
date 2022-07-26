import * as React from 'react';
import { VizComponent, VizComponentMigrationContext } from '../../types/plugin';
import { TextConfig } from './config-panel';
import { TextView } from './view';

export const TextComponent: VizComponent = {
  name: 'built-in/viz/text',
  viewRender: TextView,
  configRender: TextConfig,
  migration: async (ctx: VizComponentMigrationContext) => {
  },
};
