import chroma from 'chroma-js';
import _ from 'lodash';

const ColorRegex = {
  hex: /^#?([0-9A-F]{3}){1,2}$/i, // prevent triggering submit with short input like #000
  fullHex: /^#?([0-9A-F]{6})$/i,
  hexa: /^#?([0-9A-F]{4}){1,2}$/i, // prevent triggering submit with short input like #0001
  rgb: /^rgb\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/i,
  rgba: /^rgba\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/i,
  hsl: /hsl\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)\)/i,
  hsla: /^hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*(\d*(?:\.\d+)?)\)$/i,
};

const ValidInputRegex = _.pick(ColorRegex, 'fullHex', 'rgb', 'rgba', 'hsl', 'hsla');
const ValidPreviewRegex = _.pick(ColorRegex, 'fullHex', 'rgb', 'rgba', 'hsl', 'hsla');

export function isInputColorValid(v: string) {
  return Object.values(ValidInputRegex).some((r) => r.test(v));
}

export function isColorValidToPreview(v: string) {
  return Object.values(ValidPreviewRegex).some((r) => r.test(v));
}

export function parsePropsColor(v: string) {
  if (isColorValidToPreview(v)) {
    return v;
  }

  if (chroma.valid(v)) {
    return chroma(v).css();
  }

  return v;
}
