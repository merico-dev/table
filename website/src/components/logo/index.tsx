import { useRequest } from 'ahooks';
import { ConfigAPI } from '../../api-caller/config';
import { LogoLink } from './logo-link';
import { Box } from '@mantine/core';

export const Logo = ({ height }: { height: string | number }) => {
  const { data } = useRequest(ConfigAPI.getWebsiteSettings);
  if (!data) {
    return null;
  }

  return (
    <Box sx={{ height, img: { height: '100%' } }}>
      <LogoLink data={data} />
    </Box>
  );
};
