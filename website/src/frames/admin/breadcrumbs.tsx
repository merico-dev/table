import { Anchor, Breadcrumbs, Group, Text } from '@mantine/core';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { adminPageLinks } from './page-links';
import { Helmet } from 'react-helmet-async';

export const AdminBreadcrumbs = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const item = useMemo(() => {
    const match = adminPageLinks.find((l) => l.to === pathname);
    return match ?? null;
  }, [pathname]);

  return (
    <>
      {item && (
        <Helmet>
          <title>{item.name}</title>
        </Helmet>
      )}
      <Breadcrumbs>
        <Group spacing={6}>
          <Text size="sm" color="#868e96" sx={{ cursor: 'default', userSelect: 'none' }}>
            System Settings
          </Text>
        </Group>
        {item && (
          <Anchor key={item.to} href={item.to} size="sm">
            <Group spacing={6}>{item.name}</Group>
          </Anchor>
        )}
      </Breadcrumbs>
    </>
  );
};
