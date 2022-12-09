import { connectionHook } from './jest.util';
import request from 'supertest';
import { app } from '~/server';

describe('RoleController', () => {
  connectionHook();
  const server = request(app);

  it('list', async () => {
    const response = await server
      .get('/role/list')
      .send()

    expect(response.body).toMatchObject([
      {
        id: 10,
        name: 'INACTIVE',
        description: 'Disabled user. Can not login'
      },
      { 
        id: 20, 
        name: 'READER', 
        description: 'Can view dashboards' 
      },
      {
        id: 30,
        name: 'AUTHOR',
        description: 'Can view and create dashboards'
      },
      {
        id: 40,
        name: 'ADMIN',
        description: 'Can view and create dashboards. Can add and delete datasources. Can add users except other admins'
      },
      { 
        id: 50, 
        name: 'SUPERADMIN', 
        description: 'Can do everything' 
      }
    ]);
  });
});