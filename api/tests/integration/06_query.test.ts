import { connectionHook } from './jest.util';
import { QueryService } from '~/services/query.service';
import { DEFAULT_LANGUAGE } from '~/utils/constants';

describe('QueryService', () => {
  connectionHook();
  let queryService: QueryService;

  beforeAll(async () => {
    queryService = new QueryService();
  });

  describe('query', () => {
    it('should query pg successfully', async () => {
      const results = await queryService.query(
        'postgresql',
        'pg',
        "SELECT id, description FROM role WHERE id = 'SUPERADMIN' AND true",
        '9afa4842-77ef-4b19-8a53-034cb41ee7f6',
        'pgQuery1',
        { filters: { role_id: "'SUPERADMIN'" }, context: { true: 'true' } },
        {},
        true,
        DEFAULT_LANGUAGE,
      );
      expect(results).toMatchObject([{ id: 'SUPERADMIN', description: 'Can do everything' }]);
    });

    it('should query http successfully with GET', async () => {
      const results = await queryService.query(
        'http',
        'jsonplaceholder',
        JSON.stringify({
          host: '',
          method: 'GET',
          data: {},
          params: {},
          headers: { 'Content-Type': 'application/json' },
          url: '/posts/1',
        }),
        '9afa4842-77ef-4b19-8a53-034cb41ee7f6',
        'httpGetQuery',
        { filters: {}, context: {} },
        {},
        true,
        DEFAULT_LANGUAGE,
      );
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
      const results = await queryService.query(
        'http',
        'jsonplaceholder',
        JSON.stringify({
          host: '',
          method: 'POST',
          data: { title: 'foo', body: 'bar', userId: 1 },
          params: {},
          headers: { 'Content-Type': 'application/json' },
          url: '/posts',
        }),
        '9afa4842-77ef-4b19-8a53-034cb41ee7f6',
        'httpPostQuery',
        { filters: {}, context: {} },
        {},
        true,
        DEFAULT_LANGUAGE,
      );
      expect(results).toMatchObject({ title: 'foo', body: 'bar', userId: 1, id: 101 });
    });

    it('should query http successfully with PUT', async () => {
      const results = await queryService.query(
        'http',
        'jsonplaceholder',
        JSON.stringify({
          host: '',
          method: 'PUT',
          data: { id: 1, title: 'foo', body: 'bar', userId: 1 },
          params: {},
          headers: { 'Content-Type': 'application/json' },
          url: '/posts/1',
        }),
        '9afa4842-77ef-4b19-8a53-034cb41ee7f6',
        'httpPutQuery',
        { filters: {}, context: {} },
        {},
        true,
        DEFAULT_LANGUAGE,
      );
      expect(results).toMatchObject({ title: 'foo', body: 'bar', userId: 1, id: 1 });
    });

    it('should query http successfully with DELETE', async () => {
      const results = await queryService.query(
        'http',
        'jsonplaceholder',
        JSON.stringify({
          host: '',
          method: 'DELETE',
          data: {},
          params: {},
          headers: { 'Content-Type': 'application/json' },
          url: '/posts/1',
        }),
        '9afa4842-77ef-4b19-8a53-034cb41ee7f6',
        'httpDeleteQuery',
        { filters: {}, context: {} },
        {},
        true,
        DEFAULT_LANGUAGE,
      );
      expect(results).toMatchObject({});
    });
  });
});
