import { IconClipboardCopy, IconDatabase, IconInfoCircle, IconKey, IconUsers } from '@tabler/icons-react';

export type LinkType = {
  name: string;
  to: string;
  icon: React.ReactNode;
};

export const adminPageLinks: LinkType[] = [
  { name: 'Data Sources', to: '/admin/data_source/list', icon: <IconDatabase size={16} color="#868e96" /> },
  { name: 'SQL Snippets', to: '/admin/sql_snippet/list', icon: <IconClipboardCopy size={16} color="#868e96" /> },
  { name: 'Accounts', to: '/admin/account/list', icon: <IconUsers size={16} color="#868e96" /> },
  { name: 'API Keys', to: '/admin/api_key/list', icon: <IconKey size={16} color="#868e96" /> },
  { name: 'Status', to: '/admin/status', icon: <IconInfoCircle size={16} color="#868e96" /> },
];
