import { getDynamicColorID } from '~/components/widgets';
import { PanelRenderModelInstance } from '~/model';
import { aggregateValue } from '../aggregation';
import { formatNumber } from '../number';
import { ITemplateVariable } from './types';

export function getNonStatsDataText(data: $TSFixMe) {
  if (data === null) {
    return 'null';
  }
  if (data === undefined) {
    return 'undefined';
  }
  if (Array.isArray(data)) {
    return `Array(${data.length})`;
  }
  return data.toString();
}

export function getAggregatedValue({ data_field, aggregation }: ITemplateVariable, data: TPanelData) {
  return aggregateValue(data, data_field, aggregation);
}

export function formatAggregatedValue(
  { formatter, aggregation }: ITemplateVariable,
  value: number | string | number[] | null,
) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return getNonStatsDataText(value);
  }
  if (aggregation.type === 'custom') {
    return value;
  }
  try {
    return formatNumber(value, formatter);
  } catch (e) {
    console.error(e);
    return value;
  }
}

export function transformTemplateToRichText(template: string, panel: PanelRenderModelInstance) {
  const ret = template.replaceAll(/(\$\{([^{\}]+(?=}))\})/g, (...matches) => {
    const code = matches[2];
    const styleObj = panel.variableStyleMap[code];
    if (!styleObj) {
      return `{{${code}}}`;
    }
    const { variable, ...style } = styleObj;
    const styleStr = Object.entries(style)
      .map(([k, v]) => `${k}:${v}`)
      .join(';');
    const colorConf = variable.color;
    if (colorConf.type !== 'continuous') {
      return `<span style="${styleStr}">{{${code}}}</span>`;
    }
    const id = getDynamicColorID(6);
    const colorCode = `try {
      return utils.popmotion.interpolate(${JSON.stringify(colorConf.valueRange)}, ${JSON.stringify(
      colorConf.colorRange,
    )})(variables["${code}"]);
    } catch (error) {
      console.error(error);
      return "black";
    }`;
    return `<span style="${styleStr}"><dynamic-color id="${id}" data-value='${colorCode}'>{{${code}}}</dynamic-color></span>`;
  });
  return ret;
}
