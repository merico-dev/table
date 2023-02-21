export const DashboardJSONTypeDef = {
  type: 'object',
  properties: {
    views: { type: 'array' },
    filters: { type: 'array' },
    definition: { type: 'object' },
    version: { type: 'string' },
  },
};
