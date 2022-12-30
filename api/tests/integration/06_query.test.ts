import { connectionHook } from './jest.util';
import { QueryService } from '~/services/query.service';
import { HttpParams } from '~/api_models/query';
import * as validation from '~/middleware/validation';

describe('QueryService', () => {
  connectionHook();
  let queryService: QueryService;

  beforeAll(async () => {
    queryService = new QueryService();
  });

  describe('query', () => {
    it('should query pg successfully', async () => {
      const results = await queryService.query('postgresql', 'pg', 'SELECT * FROM role ORDER BY id ASC');
      expect(results).toMatchObject([
        {
          id: 10,
          name: 'INACTIVE',
          description: 'Disabled user. Can not login',
        },
        {
          id: 20,
          name: 'READER',
          description: 'Can view dashboards',
        },
        {
          id: 30,
          name: 'AUTHOR',
          description: 'Can view and create dashboards',
        },
        {
          id: 40,
          name: 'ADMIN',
          description:
            'Can view and create dashboards. Can add and delete datasources. Can add users except other admins',
        },
        {
          id: 50,
          name: 'SUPERADMIN',
          description: 'Can do everything',
        },
      ]);
    });

    it('should query http successfully with GET', async () => {
      const query: HttpParams = {
        method: 'GET',
        data: {},
        headers: { 'Content-Type': 'application/json' },
        url_postfix: '/posts/1',
      };
      const validate = jest.spyOn(validation, 'validate');
      validate.mockReturnValueOnce(query);
      const results = await queryService.query('http', 'jsonplaceholder', JSON.stringify(query));
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
        method: 'POST',
        data: { title: 'foo', body: 'bar', userId: 1 },
        headers: { 'Content-Type': 'application/json' },
        url_postfix: '/posts',
      };
      const validate = jest.spyOn(validation, 'validate');
      validate.mockReturnValueOnce(query);
      const results = await queryService.query('http', 'jsonplaceholder', JSON.stringify(query));
      expect(results).toMatchObject({ title: 'foo', body: 'bar', userId: 1, id: 101 });
    });

    it('should query http successfully with PUT', async () => {
      const query: HttpParams = {
        method: 'PUT',
        data: { id: 1, title: 'foo', body: 'bar', userId: 1 },
        headers: { 'Content-Type': 'application/json' },
        url_postfix: '/posts/1',
      };
      const validate = jest.spyOn(validation, 'validate');
      validate.mockReturnValueOnce(query);
      const results = await queryService.query('http', 'jsonplaceholder', JSON.stringify(query));
      expect(results).toMatchObject({ title: 'foo', body: 'bar', userId: 1, id: 1 });
    });

    it('should query http successfully with DELETE', async () => {
      const query: HttpParams = {
        method: 'DELETE',
        data: {},
        headers: { 'Content-Type': 'application/json' },
        url_postfix: '/posts/1',
      };
      const validate = jest.spyOn(validation, 'validate');
      validate.mockReturnValueOnce(query);
      const results = await queryService.query('http', 'jsonplaceholder', JSON.stringify(query));
      expect(results).toMatchObject({});
    });
  });
});
