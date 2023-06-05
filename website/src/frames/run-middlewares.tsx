import { useRequest } from 'ahooks';
import { Outlet } from 'react-router-dom';
import { APICaller } from '../api-caller';
import { LoadingOverlay } from '@mantine/core';
import { useEffect } from 'react';

export const getMiddleware = async (signal: AbortSignal) => {
  try {
    const func = await APICaller.custom_function.get('routerMiddleware', signal)();
    return func;
  } catch (error) {
    return null;
  }
};

export function RunMiddlewares() {
  const { data: func, loading } = useRequest(getMiddleware);
  useEffect(() => {
    func?.();
  }, [func]);

  if (loading) {
    return <LoadingOverlay visible />;
  }
  return <Outlet />;
}
