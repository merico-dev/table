import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import lodash from 'lodash';
import numbro from 'numbro';
import * as d3Array from 'd3-array';
import * as mathjs from 'mathjs';

export const functionUtils = {
  CryptoJS,
  d3Array,
  dayjs,
  lodash,
  numbro,
  mathjs,
};

type DescriptionType = {
  name: string;
  url: string;
  version: string;
};
const descriptions: DescriptionType[] = [
  { name: 'CryptoJS', url: 'https://github.com/brix/crypto-js', version: '4.1.1' },
  { name: 'd3Array', url: 'https://github.com/d3/d3-array', version: '3.2.0' },
  { name: 'dayjs', url: 'https://day.js.org/', version: '1.11.6' },
  { name: 'lodash', url: 'https://lodash.com/docs/4.17.15', version: '4.17.21' },
  { name: 'numbro', url: 'https://numbrojs.com/', version: '2.3.6' },
  { name: 'mathjs', url: 'https://mathjs.org/', version: '11.7.0' },
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

export const FunctionUtilsDescription = `
<p>
  Parameter <code>utils</code> is <code>functionUtils</code>, which contains:
</p>
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Document</th>
    </tr>
  </thead>
  <tbody>
    ${descriptions.map(getDescriptionRow).join('')}
  </tbody>
</table>
`;
