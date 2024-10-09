import { faker } from '@faker-js/faker';
import CryptoJS from 'crypto-js';
import * as d3Array from 'd3-array';
import dayjs from 'dayjs';
import lodash from 'lodash';
import * as mathjs from 'mathjs';
import numbro from 'numbro';
import * as popmotion from 'popmotion';

export const functionUtils = {
  CryptoJS,
  d3Array,
  dayjs,
  lodash,
  numbro,
  mathjs,
  faker,
  popmotion,
};

type DescriptionType = {
  name: string;
  url: string;
  version: string;
};
const descriptions: DescriptionType[] = [
  { name: 'CryptoJS', url: 'https://github.com/brix/crypto-js', version: '4.1.1' },
  { name: 'd3Array', url: 'https://github.com/d3/d3-array', version: '3.2.4' },
  { name: 'dayjs', url: 'https://day.js.org/', version: '1.11.6' },
  { name: 'lodash', url: 'https://lodash.com/docs/4.17.15', version: '4.17.21' },
  { name: 'mathjs', url: 'https://mathjs.org/', version: '11.12.0' },
  { name: 'numbro', url: 'https://numbrojs.com/', version: '2.3.6' },
  { name: 'faker', url: 'https://fakerjs.dev/', version: '7.6.0' },
  { name: 'popmotion', url: 'https://popmotion.io/', version: '11.0.3' },
];

const getDescriptionRow = (d: DescriptionType) => `
<tr>
  <td><code>${d.name}</code></td>
  <td>
    <a
      target="_blank"
      rel="noopener noreferrer nofollow"
      href="${d.url}"
      >${d.name}@${d.version}</a
    >
  </td>
</tr>
`;

export const getFunctionUtilsDescription = (t: any) => `
<p>
  ${t('function_utils.description')}
</p>
<table>
  <thead>
    <tr>
      <th>${t('common.name')}</th>
      <th>${t('function_utils.document')}</th>
    </tr>
  </thead>
  <tbody>
    ${descriptions.map(getDescriptionRow).join('')}
  </tbody>
</table>
`;
