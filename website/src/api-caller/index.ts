import { account } from './account';
import { api_key } from './api-key';
import { dashboard } from './dashboard';
import { dashboard_content_changelog } from './dashboard-content-changelog';
import { dashboard_content } from './dashboard-content';
import { dashboard_permission } from './dashboard-permission';
import { status } from './status';
import { custom_function } from './custom-function';
import { sql_snippet } from './sql_snippet';

export const APICaller = {
  emptyList: {
    data: [],
    total: 0,
    offset: 0,
  },
  account,
  api_key,
  custom_function,
  dashboard,
  dashboard_content_changelog,
  dashboard_content,
  dashboard_permission,
  status,
  sql_snippet,
};
