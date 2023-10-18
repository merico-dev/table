import { Breadcrumbs, Text, TextProps } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet-async';
import { useDashboardStore } from './models/dashboard-store-context';

const BreadcrumbText = ({ children, ...rest }: TextProps) => {
  return (
    <Text size="sm" color="#868e96" sx={{ cursor: 'default', userSelect: 'none' }} {...rest}>
      {children}
    </Text>
  );
};

export const DashboardBreadcrumbs = observer(() => {
  const { store } = useDashboardStore();
  const d = store.currentDetail;

  if (!d) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{d.name}</title>
      </Helmet>
      <Breadcrumbs>
        <BreadcrumbText>Dashboards</BreadcrumbText>
        {d.group ? <BreadcrumbText>{d.group}</BreadcrumbText> : null}
        <BreadcrumbText color="#232323" fw={500}>
          {d.name}
        </BreadcrumbText>
      </Breadcrumbs>
    </>
  );
});
