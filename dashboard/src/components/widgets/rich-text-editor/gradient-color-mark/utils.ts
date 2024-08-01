import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';
import _ from 'lodash';
import { TDashboardState, VariableValueMap } from '~/model';
import { GradientColorAttrKeys } from './gradient-color-mark';

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

function getVarOrVal(n: Element, variables: VariableValueMap, valKey: string, varKey: string) {
  const value = Number(n.getAttribute(valKey));
  const varName = n.getAttribute(varKey);
  if (!varName) {
    return value;
  }

  const ret = Number(variables[varName]);
  if (!Number.isFinite(ret)) {
    return value;
  }
  return ret;
}

export function getGradientColorStyle(doc: Document, variables: VariableValueMap) {
  const ret: Record<string, { color: string }> = {};
  const nodes = doc.querySelectorAll('gradient-color');
  nodes.forEach((n) => {
    const colorAttr = n.getAttribute(GradientColorAttrKeys.color);
    const min = getVarOrVal(n, variables, GradientColorAttrKeys.min_val, GradientColorAttrKeys.min_var);
    const max = getVarOrVal(n, variables, GradientColorAttrKeys.max_val, GradientColorAttrKeys.max_var);
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

  const min_val = _.get(attrs, GradientColorAttrKeys.min_val);
  const min_var = _.get(attrs, GradientColorAttrKeys.min_var);
  const max_val = _.get(attrs, GradientColorAttrKeys.max_val);
  const max_var = _.get(attrs, GradientColorAttrKeys.max_var);
  const variable = _.get(attrs, GradientColorAttrKeys.variable, '');
  return {
    colors,
    min_val,
    min_var,
    max_val,
    max_var,
    variable,
  };
}
