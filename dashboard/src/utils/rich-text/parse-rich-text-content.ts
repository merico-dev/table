import { TPayloadForViz } from '~/model';
import { aggregateValue } from '~/utils';
import { ITemplateVariable, formatAggregatedValue } from '~/utils';

function variablesToStrings(variables: ITemplateVariable[], data: TPanelData) {
  const ret: Record<string, string> = {};
  variables.forEach((variable) => {
    const { name, data_field, aggregation } = variable;
    const value = aggregateValue(data, data_field, aggregation);
    ret[name] = formatAggregatedValue(variable, value);
  });
  return ret;
}

function unescapeHTML(str: string) {
  const elt = document.createElement('span');
  elt.innerHTML = str;
  return elt.innerText;
}

function tryParsingScript(script: string, variableStrings: Record<string, string>, payload: TPayloadForViz) {
  try {
    return new Function(
      'payload',
      `
      const filters = payload.filters;
      const context = payload.context;
      ${Object.entries(variableStrings)
        .map(([k, v]) => `const ${k} = '${v}';`)
        .join('\n')}
      return ${script};
    `,
    )(payload);
  } catch (err) {
    console.error(err);
    console.log(script);
    return script;
  }
}

export function parseRichTextContent(
  rawContent: string,
  variables: ITemplateVariable[],
  payload: TPayloadForViz,
  data: TPanelData,
) {
  const variableStrings = variablesToStrings(variables, data);
  const ret = rawContent.replaceAll(/(\{\{([^{\}]+(?=}))\}\})/g, (...matches) => {
    const code = matches[2];
    if (!code) {
      return code;
    }
    const element = variableStrings[code];
    if (element) {
      return element;
    }

    const script = unescapeHTML(code);
    const result = tryParsingScript(script, variableStrings, payload);
    return result;
  });
  return ret;
}
