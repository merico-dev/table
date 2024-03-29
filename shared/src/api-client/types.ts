import { Method } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type $TSFixMe = any;
export type AnyObject = Record<string, $TSFixMe>;
export interface IAPIClientRequestOptions {
  string?: boolean;
  params?: AnyObject;
  headers?: AnyObject;
}

type TRequest<T> = (
  url: string,
  data: AnyObject,
  options: IAPIClientRequestOptions,
  forResponse?: boolean,
) => Promise<T>;

export interface IAPIClient {
  getRequest: <T = $TSFixMe>(method: Method, signal?: AbortSignal) => TRequest<T>;
  get: <T = $TSFixMe>(signal?: AbortSignal) => TRequest<T>;
  post: <T = $TSFixMe>(signal?: AbortSignal) => TRequest<T>;
  put: <T = $TSFixMe>(signal?: AbortSignal) => TRequest<T>;
}
