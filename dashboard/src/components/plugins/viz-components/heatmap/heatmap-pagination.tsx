import { NativeSelect, Pagination } from '@mantine/core';
import { useMemo } from 'react';

type Props = {
  page: number;
  setPage: (v: number) => void;
  totalPages: number;
  width: number;
};

const FullPagination = ({ page, setPage, totalPages }: Props) => {
  return (
    <Pagination
      size="xs"
      withControls={false}
      siblings={1}
      color="gray"
      value={page}
      onChange={setPage}
      total={totalPages}
    />
  );
};

const SelectorPagination = ({ page, setPage, totalPages }: Props) => {
  const options = useMemo(() => {
    return Array.from(new Array(totalPages), (_n, i) => {
      return { label: String(i + 1), value: String(i + 1) };
    });
  }, [totalPages]);

  return (
    <NativeSelect
      size="xs"
      value={page}
      onChange={(e) => {
        setPage(Number(e.currentTarget.value));
      }}
      data={options}
    />
  );
};

export const HeatmapPagination = (props: Props) => {
  if (props.totalPages <= 1) {
    return null;
  }

  return <>{props.width > 600 ? <FullPagination {...props} /> : <SelectorPagination {...props} />}</>;
};
