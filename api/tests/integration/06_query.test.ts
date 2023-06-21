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
        '9afa4842-77ef-4b19-8a53-034cb41ee7f6',
        'pgQuery1',
        { filters: { role_id: 50 }, context: { true: 'true' } },
        {},
        true,
        null,
        DEFAULT_LANGUAGE,
      );
      expect(results).toMatchObject([{ id: 50, description: 'Can do everything' }]);
    });

    it('should query http successfully with GET', async () => {
      const results = await queryService.query(
        '9afa4842-77ef-4b19-8a53-034cb41ee7f6',
        'httpGetQuery',
        { filters: {}, context: {} },
        {},
        true,
        null,
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
        '9afa4842-77ef-4b19-8a53-034cb41ee7f6',
        'httpPostQuery',
        { filters: {}, context: {} },
        {},
        true,
        null,
        DEFAULT_LANGUAGE,
      );
      expect(results).toMatchObject({ title: 'foo', body: 'bar', userId: 1, id: 101 });
    });

    it('should query http successfully with PUT', async () => {
      const results = await queryService.query(
        '9afa4842-77ef-4b19-8a53-034cb41ee7f6',
        'httpPutQuery',
        { filters: {}, context: {} },
        {},
        true,
        null,
        DEFAULT_LANGUAGE,
      );
      expect(results).toMatchObject({ title: 'foo', body: 'bar', userId: 1, id: 1 });
    });

    it('should query http successfully with DELETE', async () => {
      const results = await queryService.query(
        '9afa4842-77ef-4b19-8a53-034cb41ee7f6',
        'httpDeleteQuery',
        { filters: {}, context: {} },
        {},
        true,
        null,
        DEFAULT_LANGUAGE,
      );
      expect(results).toMatchObject({});
    });
  });
});
