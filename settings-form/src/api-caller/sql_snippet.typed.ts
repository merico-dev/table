import { PaginationResponse } from './types';

export type SQLSnippetDBType = {
  id: string;
  content: string;
  is_preset: boolean;
  create_time: string;
  update_time: string;
};

export type TCreateSQLSnippetPayload = Pick<SQLSnippetDBType, 'id' | 'content'>;
export type TUpdateSQLSnippetPayload = TCreateSQLSnippetPayload;

export type ListSQLSnippetReqType = {
  // filter?: {
  //   id: { value: string; isFuzzy: false };
  // };
  pagination: {
    page: number;
    pagesize: number;
  };
};

export type ListSQLSnippetRespType = PaginationResponse<SQLSnippetDBType>;
