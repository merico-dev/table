import { Skeleton, Stack } from '@mantine/core';

export const LoadingSkeleton = ({
  width = 'calc(100% - 32px)',
  lastWidth = '50%',
  height,
  count,
  spacing = 16,
  pl = 0,
}: {
  width?: string;
  lastWidth?: string;
  height: string;
  count: number;
  spacing?: number;
  pl?: number;
}) => {
  return (
    <Stack spacing={spacing} mt={6} pl={pl}>
      {Array.from(new Array(count - 1), (_v, i) => (
        <Skeleton key={i} width={width} height={height} radius="xs" />
      ))}
      <Skeleton width={lastWidth} height={height} radius="xs" />
    </Stack>
  );
};
