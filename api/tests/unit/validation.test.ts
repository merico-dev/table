import {
  AccountChangePasswordRequest,
  AccountCreateRequest,
  AccountEditRequest,
  AccountIDRequest,
  AccountListRequest,
  AccountLoginRequest,
  AccountUpdateRequest,
} from '~/api_models/account';
import { ApiKeyCreateRequest, ApiKeyIDRequest, ApiKeyListRequest } from '~/api_models/api';
import {
  DashboardCreateRequest,
  DashboardIDRequest,
  DashboardListRequest,
  DashboardNameRequest,
  DashboardUpdateRequest,
} from '~/api_models/dashboard';
import {
  DataSourceCreateRequest,
  DataSourceIDRequest,
  DataSourceListRequest,
  DataSourceRenameRequest,
} from '~/api_models/datasource';
import { JobListRequest, JobRunRequest } from '~/api_models/job';
import { QueryRequest } from '~/api_models/query';
import { ROLE_TYPES } from '~/api_models/role';
import { ConfigGetRequest, ConfigUpdateRequest } from '~/api_models/config';
import { DashboardChangelogListRequest } from '~/api_models/dashboard_changelog';
import { DashboardPermissionListRequest, DashboardOwnerUpdateRequest } from '~/api_models/dashboard_permission';
import { ApiError } from '~/utils/errors';
import { validate } from '~/middleware/validation';
import { VALIDATION_FAILED } from '~/utils/errors';
import { DEFAULT_LANGUAGE } from '~/utils/constants';
import * as crypto from 'crypto';

describe('validation', () => {
  describe('AccountController', () => {
    describe('AccountLoginRequest', () => {
      it('Should have no validation errors', () => {
        const data: AccountLoginRequest = {
          name: 'test',
          password: 'test',
        };

        const result = validate(AccountLoginRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(AccountLoginRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(AccountLoginRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'name',
              children: [],
              constraints: { isString: 'name must be a string' },
            },
            {
              target: {},
              value: undefined,
              property: 'password',
              children: [],
              constraints: { isString: 'password must be a string' },
            },
          ]);
        }
      });
    });

    describe('AccountListRequest', () => {
      it('Should have no validation errors', () => {
        const data: AccountListRequest = {
          pagination: { page: 1, pagesize: 20 },
          sort: [{ field: 'create_time', order: 'ASC' }],
          filter: { name: { value: '', isFuzzy: true }, email: { value: '', isFuzzy: true } },
        };

        const result = validate(AccountListRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Empty request should also have no validation errors', () => {
        const data = {};
        const result = validate(AccountListRequest, data);
        expect(result).toMatchObject({
          sort: [{ field: 'create_time', order: 'ASC' }],
          pagination: { page: 1, pagesize: 20 },
        });
      });

      it('Should have validation errors', () => {
        const data = {
          pagination: { incorrect_page: 1, incorrect_pageSize: 20 },
        };
        expect(() => validate(AccountListRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(AccountListRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {
                sort: [{ field: 'create_time', order: 'ASC' }],
                pagination: { incorrect_page: 1, incorrect_pageSize: 20 },
              },
              value: { incorrect_page: 1, incorrect_pageSize: 20 },
              property: 'pagination',
              children: [
                {
                  target: { incorrect_page: 1, incorrect_pageSize: 20 },
                  value: undefined,
                  property: 'page',
                  children: [],
                  constraints: { isInt: 'page must be an integer number' },
                },
                {
                  target: { incorrect_page: 1, incorrect_pageSize: 20 },
                  value: undefined,
                  property: 'pagesize',
                  children: [],
                  constraints: { isInt: 'pagesize must be an integer number' },
                },
              ],
            },
          ]);
        }
      });
    });

    describe('AccountCreateRequest', () => {
      it('Should have no validation errors', () => {
        const data: AccountCreateRequest = {
          name: 'test',
          password: 'test1234',
          role_id: ROLE_TYPES.AUTHOR,
        };

        const result = validate(AccountCreateRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(AccountCreateRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(AccountCreateRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'name',
              children: [],
              constraints: {
                isLength: 'name must be longer than or equal to 1 characters',
                isString: 'name must be a string',
              },
            },
            {
              target: {},
              value: undefined,
              property: 'password',
              children: [],
              constraints: {
                isLength: 'password must be longer than or equal to 8 characters',
                isString: 'password must be a string',
              },
            },
            {
              target: {},
              value: undefined,
              property: 'role_id',
              children: [],
              constraints: {
                isIn: 'role_id must be one of the following values: 10, 20, 30, 40',
                isInt: 'role_id must be an integer number',
              },
            },
          ]);
        }
      });
    });

    describe('AccountUpdateRequest', () => {
      it('Should have no validation errors', () => {
        const data: AccountUpdateRequest = {};

        const result = validate(AccountUpdateRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data: AccountUpdateRequest = {
          name: '',
          email: '',
        };
        expect(() => validate(AccountUpdateRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(AccountUpdateRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {
                email: '',
                name: '',
              },
              value: '',
              property: 'name',
              children: [],
              constraints: {
                isLength: 'name must be longer than or equal to 1 characters',
              },
            },
            {
              target: {
                email: '',
                name: '',
              },
              value: '',
              property: 'email',
              children: [],
              constraints: {
                isLength: 'email must be longer than or equal to 1 characters',
              },
            },
          ]);
        }
      });
    });

    describe('AccountEditRequest', () => {
      it('Should have no validation errors', () => {
        const data: AccountEditRequest = {
          id: crypto.randomUUID(),
        };

        const result = validate(AccountEditRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data: AccountEditRequest = {
          id: null,
          name: '',
          role_id: 0,
        };
        expect(() => validate(AccountEditRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(AccountEditRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {
                id: null,
                name: '',
                role_id: 0,
              },
              value: null,
              property: 'id',
              children: [],
              constraints: { isUuid: 'id must be a UUID' },
            },
            {
              target: {
                id: null,
                name: '',
                role_id: 0,
              },
              value: '',
              property: 'name',
              children: [],
              constraints: {
                isLength: 'name must be longer than or equal to 1 characters',
              },
            },
            {
              target: {
                id: null,
                name: '',
                role_id: 0,
              },
              value: 0,
              property: 'role_id',
              children: [],
              constraints: {
                isIn: 'role_id must be one of the following values: 10, 20, 30, 40',
              },
            },
          ]);
        }
      });
    });

    describe('AccountChangePasswordRequest', () => {
      it('Should have no validation errors', () => {
        const data: AccountChangePasswordRequest = {
          new_password: 'test1234_new',
          old_password: 'test1234',
        };

        const result = validate(AccountChangePasswordRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(AccountChangePasswordRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(AccountChangePasswordRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'old_password',
              children: [],
              constraints: {
                isString: 'old_password must be a string',
              },
            },
            {
              target: {},
              value: undefined,
              property: 'new_password',
              children: [],
              constraints: {
                isString: 'new_password must be a string',
              },
            },
          ]);
        }
      });
    });

    describe('AccountIDRequest', () => {
      it('Should have no validation errors', () => {
        const data: AccountIDRequest = {
          id: crypto.randomUUID(),
        };

        const result = validate(AccountIDRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(AccountIDRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(AccountIDRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'id',
              children: [],
              constraints: { isUuid: 'id must be a UUID' },
            },
          ]);
        }
      });
    });
  });

  describe('APIController', () => {
    describe('ApiKeyListRequest', () => {
      it('Should have no validation errors', () => {
        const data: ApiKeyListRequest = {
          pagination: { page: 1, pagesize: 20 },
          sort: [{ field: 'create_time', order: 'ASC' }],
          filter: { name: { value: '', isFuzzy: true } },
        };

        const result = validate(ApiKeyListRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Empty request should also have no validation errors', () => {
        const data = {};
        const result = validate(ApiKeyListRequest, data);
        expect(result).toMatchObject({
          sort: [{ field: 'create_time', order: 'ASC' }],
          pagination: { page: 1, pagesize: 20 },
        });
      });

      it('Should have validation errors', () => {
        const data = {
          pagination: { incorrect_page: 1, incorrect_pageSize: 20 },
        };
        expect(() => validate(ApiKeyListRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(ApiKeyListRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {
                sort: [{ field: 'create_time', order: 'ASC' }],
                pagination: { incorrect_page: 1, incorrect_pageSize: 20 },
              },
              value: { incorrect_page: 1, incorrect_pageSize: 20 },
              property: 'pagination',
              children: [
                {
                  target: { incorrect_page: 1, incorrect_pageSize: 20 },
                  value: undefined,
                  property: 'page',
                  children: [],
                  constraints: { isInt: 'page must be an integer number' },
                },
                {
                  target: { incorrect_page: 1, incorrect_pageSize: 20 },
                  value: undefined,
                  property: 'pagesize',
                  children: [],
                  constraints: { isInt: 'pagesize must be an integer number' },
                },
              ],
            },
          ]);
        }
      });
    });

    describe('ApiKeyListRequest', () => {
      it('Should have no validation errors', () => {
        const data: ApiKeyCreateRequest = {
          name: 'test',
          role_id: ROLE_TYPES.AUTHOR,
        };

        const result = validate(ApiKeyCreateRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(ApiKeyCreateRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(ApiKeyCreateRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'name',
              children: [],
              constraints: {
                isLength: 'name must be longer than or equal to 1 characters',
                isString: 'name must be a string',
              },
            },
            {
              target: {},
              value: undefined,
              property: 'role_id',
              children: [],
              constraints: {
                isIn: 'role_id must be one of the following values: 10, 20, 30, 40',
                isInt: 'role_id must be an integer number',
              },
            },
          ]);
        }
      });
    });

    describe('ApiKeyIDRequest', () => {
      it('Should have no validation errors', () => {
        const data: ApiKeyIDRequest = {
          id: crypto.randomUUID(),
        };

        const result = validate(ApiKeyIDRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(ApiKeyIDRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(ApiKeyIDRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'id',
              children: [],
              constraints: { isUuid: 'id must be a UUID' },
            },
          ]);
        }
      });
    });
  });

  describe('DashboardController', () => {
    describe('DashboardListRequest', () => {
      it('Should have no validation errors', () => {
        const data: DashboardListRequest = {
          pagination: { page: 1, pagesize: 20 },
          sort: [{ field: 'create_time', order: 'ASC' }],
          filter: { group: { value: '', isFuzzy: true }, name: { value: '', isFuzzy: true }, is_removed: false },
        };

        const result = validate(DashboardListRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Empty request should also have no validation errors', () => {
        const data = {};
        const result = validate(DashboardListRequest, data);
        expect(result).toMatchObject({
          sort: [{ field: 'create_time', order: 'ASC' }],
          pagination: { page: 1, pagesize: 20 },
        });
      });

      it('Should have validation errors', () => {
        const data = {
          pagination: { incorrect_page: 1, incorrect_pageSize: 20 },
        };
        expect(() => validate(DashboardListRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(DashboardListRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {
                sort: [{ field: 'create_time', order: 'ASC' }],
                pagination: { incorrect_page: 1, incorrect_pageSize: 20 },
              },
              value: { incorrect_page: 1, incorrect_pageSize: 20 },
              property: 'pagination',
              children: [
                {
                  target: { incorrect_page: 1, incorrect_pageSize: 20 },
                  value: undefined,
                  property: 'page',
                  children: [],
                  constraints: { isInt: 'page must be an integer number' },
                },
                {
                  target: { incorrect_page: 1, incorrect_pageSize: 20 },
                  value: undefined,
                  property: 'pagesize',
                  children: [],
                  constraints: { isInt: 'pagesize must be an integer number' },
                },
              ],
            },
          ]);
        }
      });
    });

    describe('DashboardCreateRequest', () => {
      it('Should have no validation errors', () => {
        const data: DashboardCreateRequest = {
          name: 'test',
          content: {},
          group: '',
        };

        const result = validate(DashboardCreateRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(DashboardCreateRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(DashboardCreateRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'name',
              children: [],
              constraints: {
                isLength: 'name must be longer than or equal to 1 characters',
                isString: 'name must be a string',
              },
            },
            {
              target: {},
              value: undefined,
              property: 'content',
              children: [],
              constraints: { isObject: 'content must be an object' },
            },
            {
              target: {},
              value: undefined,
              property: 'group',
              children: [],
              constraints: { isString: 'group must be a string' },
            },
          ]);
        }
      });
    });

    describe('DashboardIDRequest', () => {
      it('Should have no validation errors', () => {
        const data: DashboardIDRequest = {
          id: crypto.randomUUID(),
        };

        const result = validate(DashboardIDRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(DashboardIDRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(DashboardIDRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'id',
              children: [],
              constraints: { isUuid: 'id must be a UUID' },
            },
          ]);
        }
      });
    });

    describe('DashboardNameRequest', () => {
      it('Should have no validation errors', () => {
        const data: DashboardNameRequest = {
          name: 'test',
          is_preset: false,
        };

        const result = validate(DashboardNameRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(DashboardNameRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(DashboardNameRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'name',
              children: [],
              constraints: {
                isLength: 'name must be longer than or equal to 1 characters',
                isString: 'name must be a string',
              },
            },
            {
              target: {},
              value: undefined,
              property: 'is_preset',
              children: [],
              constraints: { isBoolean: 'is_preset must be a boolean value' },
            },
          ]);
        }
      });
    });

    describe('DashboardUpdateRequest', () => {
      it('Should have no validation errors', () => {
        const data: DashboardUpdateRequest = {
          id: crypto.randomUUID(),
          content: {},
          is_removed: true,
          name: 'test',
        };

        const result = validate(DashboardUpdateRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(DashboardUpdateRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(DashboardUpdateRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'id',
              children: [],
              constraints: { isUuid: 'id must be a UUID' },
            },
          ]);
        }
      });
    });
  });

  describe('DataSourceController', () => {
    describe('DataSourceListRequest', () => {
      it('Should have no validation errors', () => {
        const data: DataSourceListRequest = {
          pagination: { page: 1, pagesize: 20 },
          sort: [{ field: 'create_time', order: 'ASC' }],
          filter: { key: { value: '', isFuzzy: true }, type: { value: '', isFuzzy: true } },
        };

        const result = validate(DataSourceListRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Empty request should also have no validation errors', () => {
        const data = {};
        const result = validate(DataSourceListRequest, data);
        expect(result).toMatchObject({
          sort: [{ field: 'create_time', order: 'ASC' }],
          pagination: { page: 1, pagesize: 20 },
        });
      });

      it('Should have validation errors', () => {
        const data = {
          pagination: { incorrect_page: 1, incorrect_pageSize: 20 },
        };
        expect(() => validate(DataSourceListRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(DataSourceListRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {
                sort: [{ field: 'create_time', order: 'ASC' }],
                pagination: { incorrect_page: 1, incorrect_pageSize: 20 },
              },
              value: { incorrect_page: 1, incorrect_pageSize: 20 },
              property: 'pagination',
              children: [
                {
                  target: { incorrect_page: 1, incorrect_pageSize: 20 },
                  value: undefined,
                  property: 'page',
                  children: [],
                  constraints: { isInt: 'page must be an integer number' },
                },
                {
                  target: { incorrect_page: 1, incorrect_pageSize: 20 },
                  value: undefined,
                  property: 'pagesize',
                  children: [],
                  constraints: { isInt: 'pagesize must be an integer number' },
                },
              ],
            },
          ]);
        }
      });
    });

    describe('DataSourceCreateRequest', () => {
      it('Should have no validation errors', () => {
        const data: DataSourceCreateRequest = {
          config: {
            host: '',
            processing: {
              pre: '',
              post: '',
            },
            database: '',
            password: '',
            port: 0,
            username: '',
          },
          key: 'test',
          type: 'postgresql',
        };

        const result = validate(DataSourceCreateRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(DataSourceCreateRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(DataSourceCreateRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'type',
              children: [],
              constraints: {
                isIn: 'type must be one of the following values: postgresql, mysql, http',
                isString: 'type must be a string',
              },
            },
            {
              target: {},
              value: undefined,
              property: 'key',
              children: [],
              constraints: {
                isLength: 'key must be longer than or equal to 1 characters',
                isString: 'key must be a string',
              },
            },
            {
              target: {},
              value: undefined,
              property: 'config',
              children: [],
              constraints: { isObject: 'config must be an object' },
            },
          ]);
        }
      });
    });

    describe('DataSourceRenameRequest', () => {
      it('Should have no validation errors', () => {
        const data: DataSourceRenameRequest = {
          id: crypto.randomUUID(),
          key: 'test_new',
        };

        const result = validate(DataSourceRenameRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(DataSourceRenameRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(DataSourceRenameRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'id',
              children: [],
              constraints: { isUuid: 'id must be a UUID' },
            },
            {
              target: {},
              value: undefined,
              property: 'key',
              children: [],
              constraints: {
                isLength: 'key must be longer than or equal to 1 characters',
                isString: 'key must be a string',
              },
            },
          ]);
        }
      });
    });

    describe('DataSourceIDRequest', () => {
      it('Should have no validation errors', () => {
        const data: DataSourceIDRequest = {
          id: crypto.randomUUID(),
        };

        const result = validate(DataSourceIDRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(DataSourceIDRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(DataSourceIDRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'id',
              children: [],
              constraints: { isUuid: 'id must be a UUID' },
            },
          ]);
        }
      });
    });
  });

  describe('JobController', () => {
    describe('JobListRequest', () => {
      it('Should have no validation errors', () => {
        const data: JobListRequest = {
          pagination: { page: 1, pagesize: 20 },
          sort: [{ field: 'create_time', order: 'ASC' }],
          filter: { status: { value: '', isFuzzy: true }, type: { value: '', isFuzzy: true } },
        };

        const result = validate(JobListRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Empty request should also have no validation errors', () => {
        const data = {};
        const result = validate(JobListRequest, data);
        expect(result).toMatchObject({
          sort: [{ field: 'create_time', order: 'ASC' }],
          pagination: { page: 1, pagesize: 20 },
        });
      });

      it('Should have validation errors', () => {
        const data = {
          pagination: { incorrect_page: 1, incorrect_pageSize: 20 },
        };
        expect(() => validate(JobListRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(JobListRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {
                sort: [{ field: 'create_time', order: 'ASC' }],
                pagination: { incorrect_page: 1, incorrect_pageSize: 20 },
              },
              value: { incorrect_page: 1, incorrect_pageSize: 20 },
              property: 'pagination',
              children: [
                {
                  target: { incorrect_page: 1, incorrect_pageSize: 20 },
                  value: undefined,
                  property: 'page',
                  children: [],
                  constraints: { isInt: 'page must be an integer number' },
                },
                {
                  target: { incorrect_page: 1, incorrect_pageSize: 20 },
                  value: undefined,
                  property: 'pagesize',
                  children: [],
                  constraints: { isInt: 'pagesize must be an integer number' },
                },
              ],
            },
          ]);
        }
      });
    });

    describe('JobRunRequest', () => {
      it('Should have no validation errors', () => {
        const data: JobRunRequest = {
          type: 'RENAME_DATASOURCE',
        };

        const result = validate(JobRunRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(JobRunRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(JobRunRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'type',
              children: [],
              constraints: {
                isIn: 'type must be one of the following values: RENAME_DATASOURCE',
              },
            },
          ]);
        }
      });
    });
  });

  describe('QueryController', () => {
    describe('QueryRequest', () => {
      it('Should have no validation errors', () => {
        const data: QueryRequest = {
          type: 'http',
          key: 'test',
          query: '',
        };

        const result = validate(QueryRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(QueryRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(QueryRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'type',
              children: [],
              constraints: {
                isIn: 'type must be one of the following values: postgresql, mysql, http',
              },
            },
            {
              target: {},
              value: undefined,
              property: 'key',
              children: [],
              constraints: { isString: 'key must be a string' },
            },
            {
              target: {},
              value: undefined,
              property: 'query',
              children: [],
              constraints: { isString: 'query must be a string' },
            },
          ]);
        }
      });
    });
  });

  describe('ConfigController', () => {
    describe('ConfigGetRequest', () => {
      it('Should have no validation errors', () => {
        const data: ConfigGetRequest = {
          key: 'lang',
        };
        const result = validate(ConfigGetRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(ConfigGetRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(ConfigGetRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'key',
              children: [],
              constraints: { isIn: 'key must be one of the following values: lang, website_settings' },
            },
          ]);
        }
      });
    });

    describe('ConfigUpdateRequest', () => {
      it('Should have no validation errors', () => {
        const data: ConfigUpdateRequest = {
          key: 'lang',
          value: DEFAULT_LANGUAGE,
        };
        const result = validate(ConfigUpdateRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(ConfigUpdateRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(ConfigUpdateRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'key',
              children: [],
              constraints: { isIn: 'key must be one of the following values: lang, website_settings' },
            },
            {
              target: {},
              value: undefined,
              property: 'value',
              children: [],
              constraints: { isString: 'value must be a string' },
            },
          ]);
        }
      });
    });
  });

  describe('DashbboardChangelogController', () => {
    describe('DashboardChangelogListRequest', () => {
      it('Should have no validation errors', () => {
        const data: DashboardChangelogListRequest = {
          pagination: { page: 1, pagesize: 20 },
          sort: [{ field: 'create_time', order: 'ASC' }],
          filter: { dashboard_id: { value: '', isFuzzy: true } },
        };

        const result = validate(DashboardChangelogListRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Empty request should also have no validation errors', () => {
        const data = {};
        const result = validate(DashboardChangelogListRequest, data);
        expect(result).toMatchObject({
          sort: [{ field: 'create_time', order: 'ASC' }],
          pagination: { page: 1, pagesize: 20 },
        });
      });

      it('Should have validation errors', () => {
        const data = {
          pagination: { incorrect_page: 1, incorrect_pageSize: 20 },
        };
        expect(() => validate(DashboardChangelogListRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(DashboardChangelogListRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {
                sort: [{ field: 'create_time', order: 'ASC' }],
                pagination: { incorrect_page: 1, incorrect_pageSize: 20 },
              },
              value: { incorrect_page: 1, incorrect_pageSize: 20 },
              property: 'pagination',
              children: [
                {
                  target: { incorrect_page: 1, incorrect_pageSize: 20 },
                  value: undefined,
                  property: 'page',
                  children: [],
                  constraints: { isInt: 'page must be an integer number' },
                },
                {
                  target: { incorrect_page: 1, incorrect_pageSize: 20 },
                  value: undefined,
                  property: 'pagesize',
                  children: [],
                  constraints: { isInt: 'pagesize must be an integer number' },
                },
              ],
            },
          ]);
        }
      });
    });
  });

  describe('DashboardPermissionController', () => {
    describe('DashboardPermissionListRequest', () => {
      it('Should have no validation errors', () => {
        const data: DashboardPermissionListRequest = {
          pagination: { page: 1, pagesize: 20 },
          sort: [{ field: 'create_time', order: 'ASC' }],
          filter: { id: { value: '', isFuzzy: true } },
        };

        const result = validate(DashboardPermissionListRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Empty request should also have no validation errors', () => {
        const data = {};
        const result = validate(DashboardPermissionListRequest, data);
        expect(result).toMatchObject({
          sort: [{ field: 'create_time', order: 'ASC' }],
          pagination: { page: 1, pagesize: 20 },
        });
      });

      it('Should have validation errors', () => {
        const data = {
          pagination: { incorrect_page: 1, incorrect_pageSize: 20 },
        };
        expect(() => validate(DashboardPermissionListRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(DashboardPermissionListRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {
                sort: [{ field: 'create_time', order: 'ASC' }],
                pagination: { incorrect_page: 1, incorrect_pageSize: 20 },
              },
              value: { incorrect_page: 1, incorrect_pageSize: 20 },
              property: 'pagination',
              children: [
                {
                  target: { incorrect_page: 1, incorrect_pageSize: 20 },
                  value: undefined,
                  property: 'page',
                  children: [],
                  constraints: { isInt: 'page must be an integer number' },
                },
                {
                  target: { incorrect_page: 1, incorrect_pageSize: 20 },
                  value: undefined,
                  property: 'pagesize',
                  children: [],
                  constraints: { isInt: 'pagesize must be an integer number' },
                },
              ],
            },
          ]);
        }
      });
    });

    describe('DashboardOwnerUpdateRequest', () => {
      it('should have no validation errors', () => {
        const data: DashboardOwnerUpdateRequest = {
          id: crypto.randomUUID(),
          owner_id: crypto.randomUUID(),
          owner_type: 'ACCOUNT',
        };
        const result = validate(DashboardOwnerUpdateRequest, data);
        expect(result).toMatchObject(data);
      });

      it('Should have validation errors', () => {
        const data = {};
        expect(() => validate(DashboardOwnerUpdateRequest, data)).toThrow(
          new ApiError(VALIDATION_FAILED, { message: `request body is incorrect` }),
        );
        try {
          validate(DashboardOwnerUpdateRequest, data);
        } catch (error) {
          expect(error.detail.errors).toMatchObject([
            {
              target: {},
              value: undefined,
              property: 'id',
              children: [],
              constraints: { isUuid: 'id must be a UUID' },
            },
            {
              target: {},
              value: undefined,
              property: 'owner_type',
              children: [],
              constraints: { isIn: 'owner_type must be one of the following values: ACCOUNT, APIKEY' },
            },
            {
              target: {},
              value: undefined,
              property: 'owner_id',
              children: [],
              constraints: { isUuid: 'owner_id must be a UUID' },
            },
          ]);
        }
      });
    });
  });
});
