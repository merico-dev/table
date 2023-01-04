export const version = import('../package.json').then((p) => p.version);
console.log(`[@devtable/settings-form] version: ${version}`);

export * from './datasource';
export * from './account';
export * from './api-key';

export * from './api-caller/account.typed';
export * from './api-caller/datasource.typed';
export * from './api-caller/role.typed';
