import { connectionHook } from './jest.util';
import { SqlSnippetService } from '~/services/sql_snippet.service';
import { DEFAULT_LANGUAGE } from '~/utils/constants';
import { omitTime } from '~/utils/helpers';
import { ApiError, BAD_REQUEST } from '~/utils/errors';
import { notFoundId } from './constants';
import { EntityNotFoundError } from 'typeorm';

describe('SqlSnippetService', () => {
  connectionHook();
  let sqlSnippetService: SqlSnippetService;

  beforeAll(async () => {
    sqlSnippetService = new SqlSnippetService();
  });
  describe('create', () => {
    it('should create successfully', async () => {
      const sqlSnippet = await sqlSnippetService.create('sqlSnippet', 'test', DEFAULT_LANGUAGE);
      expect(omitTime(sqlSnippet)).toMatchObject({
        id: 'sqlSnippet',
        content: 'test',
        is_preset: false,
      });
    });
    it('should fail if duplicate', async () => {
      await expect(sqlSnippetService.create('sqlSnippet', 'test', DEFAULT_LANGUAGE)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'A sql snippet with that id already exists' }),
      );
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const sqlSnippetUpdated = await sqlSnippetService.update('sqlSnippet', 'test_updated', DEFAULT_LANGUAGE);
      expect(omitTime(sqlSnippetUpdated)).toMatchObject({
        id: 'sqlSnippet',
        content: 'test_updated',
        is_preset: false,
      });
    });
    it('should fail if preset', async () => {
      await expect(sqlSnippetService.update('presetSqlSnippet', '', DEFAULT_LANGUAGE)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Preset sql snippets can not be edited' }),
      );
    });
    it('should fail if not found', async () => {
      await expect(sqlSnippetService.update(notFoundId, '', DEFAULT_LANGUAGE)).rejects.toThrowError(
        EntityNotFoundError,
      );
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const results = await sqlSnippetService.list(undefined, [{ field: 'id', order: 'ASC' }], {
        page: 1,
        pagesize: 20,
      });
      results.data = results.data.map(omitTime);
      expect(results).toMatchObject({
        total: 4,
        offset: 0,
        data: [
          {
            id: 'presetSqlSnippet',
            content: 'presetSnippet',
            is_preset: true,
          },
          {
            id: 'sqlSnippet',
            content: 'test_updated',
            is_preset: false,
          },
          {
            id: 'SqlSnippet1',
            content: 'snippet1',
            is_preset: false,
          },
          {
            id: 'SqlSnippet2',
            content: 'snippet2',
            is_preset: false,
          },
        ],
      });
    });

    it('with search filter', async () => {
      const results = await sqlSnippetService.list(
        { id: { isFuzzy: true, value: 'preset' } },
        [{ field: 'id', order: 'ASC' }],
        {
          page: 1,
          pagesize: 20,
        },
      );
      results.data = results.data.map(omitTime);
      expect(results).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: 'presetSqlSnippet',
            content: 'presetSnippet',
            is_preset: true,
          },
        ],
      });
    });
  });

  describe('get', () => {
    it('should return successfully', async () => {
      const sqlSnippet = await sqlSnippetService.get('sqlSnippet');
      expect(omitTime(sqlSnippet)).toMatchObject({
        id: 'sqlSnippet',
        content: 'test_updated',
        is_preset: false,
      });
    });

    it('should fail', async () => {
      await expect(sqlSnippetService.get(notFoundId)).rejects.toThrowError(EntityNotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete successfully', async () => {
      await sqlSnippetService.delete('sqlSnippet', DEFAULT_LANGUAGE);
    });

    it('should fail if not found', async () => {
      await expect(sqlSnippetService.delete(notFoundId, DEFAULT_LANGUAGE)).rejects.toThrowError(EntityNotFoundError);
    });

    it('should fail if preset', async () => {
      await expect(sqlSnippetService.delete('presetSqlSnippet', DEFAULT_LANGUAGE)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Preset sql snippets can not be deleted' }),
      );
    });
  });
});
