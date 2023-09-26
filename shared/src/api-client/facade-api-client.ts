import { Method } from 'axios';
import { AnyObject, IAPIClient, IAPIClientRequestOptions } from './types';

export class FacadeApiClient implements IAPIClient {
  constructor(public implementation: IAPIClient) {}

  getRequest<T>(
    method: Method,
    signal?: AbortSignal,
  ): (url: string, data: AnyObject, options?: IAPIClientRequestOptions) => Promise<T> {
    return this.implementation.getRequest(method, signal);
  }
}
