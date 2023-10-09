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

  describe('queryStructure', () => {
    it('TABLES', async () => {
      const results = await queryService.queryStructure('TABLES', 'postgresql', 'pg', '', '');
      expect(results.length).toEqual(222);
      expect(results[212]).toMatchObject({
        table_schema: 'public',
        table_name: 'dashboard',
        table_type: 'BASE TABLE',
      });
    });

    it('COLUMNS', async () => {
      const results = await queryService.queryStructure('COLUMNS', 'postgresql', 'pg', 'public', 'dashboard');
      expect(results).toMatchObject([
        {
          ordinal_position: 1,
          column_key: 'P',
          column_key_text: 'PRIMARY KEY (id)',
          column_name: 'id',
          column_type: 'uuid',
          is_nullable: 'NO',
          column_default: 'gen_random_uuid()',
          column_comment: null,
        },
        {
          ordinal_position: 2,
          column_key: null,
          column_key_text: null,
          column_name: 'name',
          column_type: 'character varying',
          is_nullable: 'NO',
          column_default: null,
          column_comment: null,
        },
        {
          ordinal_position: 4,
          column_key: null,
          column_key_text: null,
          column_name: 'create_time',
          column_type: 'timestamp with time zone',
          is_nullable: 'NO',
          column_default: 'CURRENT_TIMESTAMP',
          column_comment: null,
        },
        {
          ordinal_position: 5,
          column_key: null,
          column_key_text: null,
          column_name: 'update_time',
          column_type: 'timestamp with time zone',
          is_nullable: 'NO',
          column_default: 'CURRENT_TIMESTAMP',
          column_comment: null,
        },
        {
          ordinal_position: 6,
          column_key: null,
          column_key_text: null,
          column_name: 'is_removed',
          column_type: 'boolean',
          is_nullable: 'NO',
          column_default: 'false',
          column_comment: null,
        },
        {
          ordinal_position: 7,
          column_key: null,
          column_key_text: null,
          column_name: 'is_preset',
          column_type: 'boolean',
          is_nullable: 'NO',
          column_default: 'false',
          column_comment: null,
        },
        {
          ordinal_position: 8,
          column_key: null,
          column_key_text: null,
          column_name: 'group',
          column_type: 'character varying',
          is_nullable: 'NO',
          column_default: "''::character varying",
          column_comment: null,
        },
        {
          ordinal_position: 9,
          column_key: 'F',
          column_key_text: 'FOREIGN KEY (content_id) REFERENCES dashboard_content(id) ON DELETE SET NULL',
          column_name: 'content_id',
          column_type: 'uuid',
          is_nullable: 'YES',
          column_default: null,
          column_comment: null,
        },
      ]);
    });

    it('DATA', async () => {
      const results = await queryService.queryStructure('DATA', 'postgresql', 'pg', 'public', 'dashboard');
      expect(results.length).toEqual(3);
    });

    it('COUNT', async () => {
      const results = await queryService.queryStructure('COUNT', 'postgresql', 'pg', 'public', 'dashboard');
      expect(results).toMatchObject([{ total: '3' }]);
    });

    it('INDEXES', async () => {
      const results = await queryService.queryStructure('INDEXES', 'postgresql', 'pg', 'public', 'dashboard');
      expect(results).toMatchObject([
        {
          index_name: 'dashboard_pkey',
          index_algorithm: 'BTREE',
          is_unique: true,
          index_definition: 'CREATE UNIQUE INDEX dashboard_pkey ON public.dashboard USING btree (id)',
          condition: '',
          comment: null,
        },
        {
          index_name: 'dashboard_name_preset_idx',
          index_algorithm: 'BTREE',
          is_unique: true,
          index_definition:
            'CREATE UNIQUE INDEX dashboard_name_preset_idx ON public.dashboard USING btree (name, is_preset) WHERE (is_removed = false)',
          condition: '(is_removed = false)',
          comment: null,
        },
      ]);
    });
  });
});
