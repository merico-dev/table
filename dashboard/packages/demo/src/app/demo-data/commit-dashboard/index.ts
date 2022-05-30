import { IDashboard } from '@devtable/dashboard';

import { panels } from './panels';

export const DEMO_COMMIT_DASHBOARD: IDashboard = {
  id: 'demo',
  name: 'Demo Dashboard',
  definition: {
    sqlSnippets: [
      {
        key: 'author_time_condition',
        value: "author_time BETWEEN '${timeRange?.[0].toISOString()}' AND '${timeRange?.[1].toISOString()}'",
      },
      {
        key: 'repo_id_condition',
        value: `\${repoIDs.length > 0 ? \`repo_id IN (\${repoIDs.map(id => "'" + id + "'").join(",")})\` : 'TRUE' }`,
      },
      {
        key: 'author_email_condition',
        value: `\${emails.length > 0 ? \`author_email IN (\${emails.map(v => "'" + v + "'").join(",")})\` : 'TRUE' }`,
      },
    ],
  },
  panels,
};
