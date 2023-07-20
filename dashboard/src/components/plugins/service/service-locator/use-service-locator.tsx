import { useCreation, usePrevious } from 'ahooks';
import React, { createContext, ReactNode } from 'react';
import { IServiceLocator, ServiceLocator } from '~/components/plugins/service/service-locator/index';

export const ServiceLocatorContext = createContext(null as unknown as IServiceLocator);

export function ServiceLocatorProvider(props: {
  configure: (services: IServiceLocator) => IServiceLocator;
  children: ReactNode;
}) {
  const parentLocator = React.useContext(ServiceLocatorContext);
  const services = useCreation(() => {
    return props.configure(parentLocator || new ServiceLocator());
  }, [props.configure]);

  const previousServices = usePrevious(services);
  if (previousServices && previousServices !== services) {
    previousServices.dispose();
  }

  return <ServiceLocatorContext.Provider value={services}>{props.children}</ServiceLocatorContext.Provider>;
}

export function useServiceLocator(): IServiceLocator {
  return React.useContext(ServiceLocatorContext);
}
