import { TDashboardState, VariableValueMap } from '~/model';
import { functionUtils } from '~/utils';
import { MonacoEditorRestriction } from '../../function-editor';
import { GradientColorAttrKeys } from './gradient-color-mark';
import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';
import _ from 'lodash';

export const GradientColorIDPrefix = 'grad_color_';
export const IDPrefixReg = new RegExp(`^(?!${GradientColorIDPrefix})(.+)$`);
export function ensurePrefixOnID(id: string | null) {
  if (!id) {
    return id;
  }
  return id.replace(IDPrefixReg, `${GradientColorIDPrefix}$1`);
}

// TODO: replace this with getRandomID
export const getGradientColorID = (size: number) => {
  const MASK = 0x3d;
  const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
  const NUMBERS = '1234567890';
  const charset = `${NUMBERS}${LETTERS}${LETTERS.toUpperCase()}`.split('');

  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);

  const id = bytes.reduce((acc, byte) => `${acc}${charset[byte & MASK]}`, '');
  return `${GradientColorIDPrefix}${id}`;
};

export function getGradientColorFunc(colors: string[], min: number, max: number) {
  try {
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      throw new Error(`[getGradientColorFunc] invalid interval with min[${min}] max[${max}]`);
    }
    if (colors.length < 2) {
      throw new Error(`[getGradientColorFunc] expected at least 2 colors`);
    }
    const step = (max - min) / (colors.length - 1);
    const domain = d3Array.range(min, max + step, step);
    return d3Scale.scaleLinear(domain, colors);
  } catch (error) {
    console.error(error);
    return () => 'inherit';
  }
}

export function getGradientColorStyle(doc: Document, dashboardState: TDashboardState, variables: VariableValueMap) {
  const ret: Record<string, { color: string }> = {};
  const nodes = doc.querySelectorAll('gradient-color');
  nodes.forEach((n) => {
    const colorAttr = n.getAttribute(GradientColorAttrKeys.color);
    const min = Number(n.getAttribute(GradientColorAttrKeys.min));
    const max = Number(n.getAttribute(GradientColorAttrKeys.max));
    const variable = n.getAttribute(GradientColorAttrKeys.variable);
    if (!colorAttr || !Number.isFinite(min) || !Number.isFinite(max) || !variable) {
      return;
    }
    const value = Number(variables[variable]);
    if (!Number.isFinite(value)) {
      return;
    }

    const colors = JSON.parse(colorAttr);
    const func = getGradientColorFunc(colors, min, max);

    ret[`#${ensurePrefixOnID(n.id)}`] = {
      color: func(value),
    };
  });

  return ret;
}

export function parseGradientColorAttrs(attrs: Record<keyof typeof GradientColorAttrKeys, string>) {
  const color = _.get(attrs, GradientColorAttrKeys.color, '[]');
  let colors = [];
  try {
    colors = JSON.parse(color);
  } catch (error) {}

  const min = _.get(attrs, GradientColorAttrKeys.min);
  const max = _.get(attrs, GradientColorAttrKeys.max);
  const variable = _.get(attrs, GradientColorAttrKeys.variable, '');
  return {
    colors,
    min,
    max,
    variable,
  };
}
