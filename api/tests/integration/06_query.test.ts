import { connectionHook } from './jest.util';
import { QueryService } from '~/services/query.service';
import { HttpParams } from '~/api_models/query';
import * as validation from '~/middleware/validation';
import { FIXED_ROLE_PERMISSIONS, FIXED_ROLE_TYPES } from '~/services/role.service';

describe('QueryService', () => {
  connectionHook();
  let queryService: QueryService;

  beforeAll(async () => {
    queryService = new QueryService();
  });

  describe('query', () => {
    it('should query pg successfully', async () => {
      const results = await queryService.query('postgresql', 'pg', 'SELECT * FROM role ORDER BY id ASC', {});
      expect(results).toMatchObject([
        {
          id: FIXED_ROLE_TYPES.ADMIN,
          description:
            'Can view and create dashboards. Can add and delete datasources. Can add users except other admins',
          permissions: FIXED_ROLE_PERMISSIONS.ADMIN,
        },
        {
          id: FIXED_ROLE_TYPES.AUTHOR,
          description: 'Can view and create dashboards',
          permissions: FIXED_ROLE_PERMISSIONS.AUTHOR,
        },
        {
          id: FIXED_ROLE_TYPES.INACTIVE,
          description: 'Disabled user. Can not login',
          permissions: [],
        },
        {
          id: FIXED_ROLE_TYPES.READER,
          description: 'Can view dashboards',
          permissions: FIXED_ROLE_PERMISSIONS.READER,
        },
        {
          id: FIXED_ROLE_TYPES.SUPERADMIN,
          description: 'Can do everything',
          permissions: FIXED_ROLE_PERMISSIONS.SUPERADMIN,
        },
      ]);
    });

    it('should query http successfully with GET', async () => {
      const query: HttpParams = {
        host: '',
        method: 'GET',
        data: {},
        params: {},
        headers: { 'Content-Type': 'application/json' },
        url: '/posts/1',
      };
      const validateClass = jest.spyOn(validation, 'validateClass');
      validateClass.mockReturnValueOnce(query);
      const results = await queryService.query('http', 'jsonplaceholder', JSON.stringify(query), {});
      expect(results).toMatchObject({
        userId: 1,
        id: 1,
        title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        body:
          'quia et suscipit\n' +
          'suscipit recusandae consequuntur expedita et cum\n' +
          'reprehenderit molestiae ut ut quas totam\n' +
          'nostrum rerum est autem sunt rem eveniet architecto',
      });
    });

    it('should query http successfully with POST', async () => {
      const query: HttpParams = {
        host: '',
        method: 'POST',
        data: { title: 'foo', body: 'bar', userId: 1 },
        params: {},
        headers: { 'Content-Type': 'application/json' },
        url: '/posts',
      };
      const validateClass = jest.spyOn(validation, 'validateClass');
      validateClass.mockReturnValueOnce(query);
      const results = await queryService.query('http', 'jsonplaceholder', JSON.stringify(query), {});
      expect(results).toMatchObject({ title: 'foo', body: 'bar', userId: 1, id: 101 });
    });

    it('should query http successfully with PUT', async () => {
      const query: HttpParams = {
        host: '',
        method: 'PUT',
        data: { id: 1, title: 'foo', body: 'bar', userId: 1 },
        params: {},
        headers: { 'Content-Type': 'application/json' },
        url: '/posts/1',
      };
      const validateClass = jest.spyOn(validation, 'validateClass');
      validateClass.mockReturnValueOnce(query);
      const results = await queryService.query('http', 'jsonplaceholder', JSON.stringify(query), {});
      expect(results).toMatchObject({ title: 'foo', body: 'bar', userId: 1, id: 1 });
    });

    it('should query http successfully with DELETE', async () => {
      const query: HttpParams = {
        host: '',
        method: 'DELETE',
        data: {},
        params: {},
        headers: { 'Content-Type': 'application/json' },
        url: '/posts/1',
      };
      const validateClass = jest.spyOn(validation, 'validateClass');
      validateClass.mockReturnValueOnce(query);
      const results = await queryService.query('http', 'jsonplaceholder', JSON.stringify(query), {});
      expect(results).toMatchObject({});
    });
  });
});
