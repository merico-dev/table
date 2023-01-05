export const getVersion = () =>
  import('../package.json').then(({ version }) => {
    console.log(`[@devtable/dashboard] version: ${version}`);
    return version;
  });

export * from './datasource';
export * from './account';
export * from './api-key';

export * from './api-caller/account.typed';
export * from './api-caller/datasource.typed';
export * from './api-caller/role.typed';
