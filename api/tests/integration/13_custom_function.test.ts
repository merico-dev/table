import { connectionHook } from './jest.util';
import { CustomFunctionService } from '~/services/custom_function.service';
import { DEFAULT_LANGUAGE } from '~/utils/constants';
import { omitTime } from '~/utils/helpers';
import { ApiError, BAD_REQUEST } from '~/utils/errors';
import { notFoundId } from './constants';
import { EntityNotFoundError } from 'typeorm';

describe('CustomFunctionService', () => {
  connectionHook();
  let customFunctionService: CustomFunctionService;

  beforeAll(async () => {
    customFunctionService = new CustomFunctionService();
  });
  describe('create', () => {
    it('should create successfully', async () => {
      const customFunction = await customFunctionService.create(
        'customFunction',
        '() => console.log("hello world")',
        DEFAULT_LANGUAGE,
      );
      expect(omitTime(customFunction)).toMatchObject({
        id: 'customFunction',
        definition: '() => console.log("hello world")',
        is_preset: false,
      });
    });
    it('should fail if duplicate', async () => {
      await expect(
        customFunctionService.create('customFunction', '() => console.log("hello world")', DEFAULT_LANGUAGE),
      ).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'A custom function with that id already exists' }));
    });
  });

  describe('createOrUpdate', () => {
    it('should update successfully', async () => {
      const customFunctionUpdated = await customFunctionService.update(
        'customFunction',
        '() => console.log("hello world!!!")',
        DEFAULT_LANGUAGE,
      );
      expect(omitTime(customFunctionUpdated)).toMatchObject({
        id: 'customFunction',
        definition: '() => console.log("hello world!!!")',
        is_preset: false,
      });
    });
    it('should fail if preset', async () => {
      await expect(customFunctionService.update('presetAddFunction', '', DEFAULT_LANGUAGE)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Preset custom functions can not be edited' }),
      );
    });
    it('should fail if not found', async () => {
      await expect(customFunctionService.update(notFoundId, '', DEFAULT_LANGUAGE)).rejects.toThrowError(
        EntityNotFoundError,
      );
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const results = await customFunctionService.list(undefined, [{ field: 'id', order: 'ASC' }], {
        page: 1,
        pagesize: 20,
      });
      results.data = results.data.map(omitTime);
      expect(results).toMatchObject({
        total: 4,
        offset: 0,
        data: [
          {
            id: 'customFunction',
            definition: '() => console.log("hello world!!!")',
            is_preset: false,
          },
          {
            id: 'divideFunction',
            definition: '(x, y) => x / y',
            is_preset: false,
          },
          {
            id: 'multiplyFunction',
            definition: '(x, y) => x * y',
            is_preset: false,
          },
          {
            id: 'presetAddFunction',
            definition: '(x, y) => x + y',
            is_preset: true,
          },
        ],
      });
    });

    it('with search filter', async () => {
      const results = await customFunctionService.list(
        { id: { isFuzzy: true, value: 'divide' } },
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
            id: 'divideFunction',
            definition: '(x, y) => x / y',
            is_preset: false,
          },
        ],
      });
    });
  });

  describe('get', () => {
    it('should return successfully', async () => {
      const customFunction = await customFunctionService.get('customFunction');
      expect(omitTime(customFunction)).toMatchObject({
        id: 'customFunction',
        definition: '() => console.log("hello world!!!")',
        is_preset: false,
      });
    });

    it('should fail', async () => {
      await expect(customFunctionService.get(notFoundId)).rejects.toThrowError(EntityNotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete successfully', async () => {
      await customFunctionService.delete('customFunction', DEFAULT_LANGUAGE);
    });

    it('should fail if not found', async () => {
      await expect(customFunctionService.delete(notFoundId, DEFAULT_LANGUAGE)).rejects.toThrowError(
        EntityNotFoundError,
      );
    });

    it('should fail if preset', async () => {
      await expect(customFunctionService.delete('presetAddFunction', DEFAULT_LANGUAGE)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Preset custom functions can not be deleted' }),
      );
    });
  });
});
