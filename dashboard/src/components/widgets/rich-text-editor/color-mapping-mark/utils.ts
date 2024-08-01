import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';
import _ from 'lodash';
import { VariableValueMap } from '~/model';
import { ColorMappingAttrKeys } from './color-mapping-mark';

export const ColorMappingIDPrefix = 'grad_color_';
export const IDPrefixReg = new RegExp(`^(?!${ColorMappingIDPrefix})(.+)$`);
export function ensurePrefixOnID(id: string | null) {
  if (!id) {
    return id;
  }
  return id.replace(IDPrefixReg, `${ColorMappingIDPrefix}$1`);
}

// TODO: replace this with getRandomID
export const getColorMappingID = (size: number) => {
  const MASK = 0x3d;
  const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
  const NUMBERS = '1234567890';
  const charset = `${NUMBERS}${LETTERS}${LETTERS.toUpperCase()}`.split('');

  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);

  const id = bytes.reduce((acc, byte) => `${acc}${charset[byte & MASK]}`, '');
  return `${ColorMappingIDPrefix}${id}`;
};

export function getColorMappingFunc(colors: string[], min: number, max: number) {
  try {
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      throw new Error(`[getColorMappingFunc] invalid interval with min[${min}] max[${max}]`);
    }
    if (colors.length < 2) {
      throw new Error(`[getColorMappingFunc] expected at least 2 colors`);
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

export function getColorMappingStyle(doc: Document, variables: VariableValueMap) {
  const ret: Record<string, { color: string }> = {};
  const nodes = doc.querySelectorAll('color-mapping');
  nodes.forEach((n) => {
    const colorAttr = n.getAttribute(ColorMappingAttrKeys.color);
    const min = getVarOrVal(n, variables, ColorMappingAttrKeys.min_val, ColorMappingAttrKeys.min_var);
    const max = getVarOrVal(n, variables, ColorMappingAttrKeys.max_val, ColorMappingAttrKeys.max_var);
    const variable = n.getAttribute(ColorMappingAttrKeys.variable);
    if (!colorAttr || !Number.isFinite(min) || !Number.isFinite(max) || !variable) {
      return;
    }
    const value = Number(variables[variable]);
    if (!Number.isFinite(value)) {
      return;
    }

    const colors = colorAttr.split(',');
    const func = getColorMappingFunc(colors, min, max);

    ret[`#${ensurePrefixOnID(n.id)}`] = {
      color: func(value),
    };
  });

  return ret;
}

export function parseColorMappingAttrs(attrs: Record<keyof typeof ColorMappingAttrKeys, string>) {
  const colors: string[] = _.get(attrs, ColorMappingAttrKeys.color, []);
  const min_val = _.get(attrs, ColorMappingAttrKeys.min_val, '');
  const min_var = _.get(attrs, ColorMappingAttrKeys.min_var, '');
  const max_val = _.get(attrs, ColorMappingAttrKeys.max_val, '');
  const max_var = _.get(attrs, ColorMappingAttrKeys.max_var, '');
  const variable = _.get(attrs, ColorMappingAttrKeys.variable, '');

  const empty = colors.length === 0 && [min_val, min_var, max_val, max_var, variable].every((v) => v === '');
  return {
    colors,
    min_val,
    min_var,
    max_val,
    max_var,
    variable,
    empty,
  };
}
